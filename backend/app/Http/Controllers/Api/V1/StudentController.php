<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\StudentResource;
use App\Models\AcademicYear;
use App\Models\Student;
use App\Models\StudentEnrollment;
use App\Models\StudentGuardian;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/students",
     *      summary="List all Students",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Paginated students list")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Student::with(['guardians', 'enrollments.academicYear', 'enrollments.schoolClass', 'enrollments.section', 'enrollments.house']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'ilike', "%{$search}%")
                  ->orWhere('last_name', 'ilike', "%{$search}%")
                  ->orWhere('admission_number', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%")
                  ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('class_id')) {
            $classId = $request->class_id;
            $query->whereHas('enrollments', function ($eq) use ($classId) {
                $eq->where('class_id', $classId)->where('status', 'active');
            });
        }

        if ($request->filled('section_id')) {
            $sectionId = $request->section_id;
            $query->whereHas('enrollments', function ($eq) use ($sectionId) {
                $eq->where('section_id', $sectionId)->where('status', 'active');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->input('per_page', 15);
        $students = $query->latest()->paginate($perPage);

        return $this->paginatedResponse($students);
    }

    /**
     * @OA\Get(
     *      path="/students/{id}",
     *      summary="Get Student Profile Details",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Student profile details")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $student = Student::with(['guardians', 'documents', 'enrollments.academicYear', 'enrollments.schoolClass', 'enrollments.section', 'enrollments.house'])->findOrFail($id);
        return $this->successResponse(new StudentResource($student));
    }

    /**
     * @OA\Post(
     *      path="/students",
     *      summary="Admit / Create New Student Master Record with Guardian & Enrollment",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Student admitted successfully")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            // Student Master
            'institute_id' => 'required|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'admission_number' => 'required|string|max:50|unique:students,admission_number',
            'admission_date' => 'required|date',
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'gender' => 'nullable|string|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'blood_group' => 'nullable|string|max:10',
            'nationality' => 'nullable|string|max:50',
            'religion' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:50',
            'email' => 'nullable|email|unique:students,email',
            'phone' => 'nullable|string|max:25',
            'current_address' => 'nullable|string',
            'permanent_address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive,transferred,graduated,expelled',
            'create_user_account' => 'nullable|boolean',
            'password' => 'nullable|string|min:8',

            // Initial Enrollment
            'academic_year_id' => 'required|exists:academic_years,id',
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'required|exists:sections,id',
            'house_id' => 'nullable|exists:houses,id',
            'roll_number' => 'nullable|string|max:50',

            // Guardian
            'guardian_name' => 'required|string|max:150',
            'guardian_relation' => 'required|string|max:50',
            'guardian_phone' => 'nullable|string|max:25',
            'guardian_email' => 'nullable|email',
            'guardian_occupation' => 'nullable|string|max:100',
            'guardian_annual_income' => 'nullable|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $userId = null;
            if (!empty($validated['create_user_account']) && !empty($validated['email'])) {
                $user = User::create([
                    'name' => trim("{$validated['first_name']} " . ($validated['last_name'] ?? '')),
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password'] ?? 'Student@12345'),
                    'phone' => $validated['phone'] ?? null,
                    'user_type' => 'student',
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]);
                $user->assignRole('student');
                $userId = $user->id;
            }

            // Create Student
            $student = Student::create([
                'user_id' => $userId,
                'institute_id' => $validated['institute_id'],
                'branch_id' => $validated['branch_id'] ?? null,
                'admission_number' => $validated['admission_number'],
                'admission_date' => $validated['admission_date'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'blood_group' => $validated['blood_group'] ?? null,
                'nationality' => $validated['nationality'] ?? 'Indian',
                'religion' => $validated['religion'] ?? null,
                'category' => $validated['category'] ?? 'General',
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'current_address' => $validated['current_address'] ?? null,
                'permanent_address' => $validated['permanent_address'] ?? null,
                'emergency_contact' => $validated['emergency_contact'] ?? null,
                'status' => $validated['status'] ?? 'active',
            ]);

            // Create Guardian
            StudentGuardian::create([
                'student_id' => $student->id,
                'guardian_type' => strtolower($validated['guardian_relation']) === 'mother' ? 'mother' : 'father',
                'name' => $validated['guardian_name'],
                'relation' => $validated['guardian_relation'],
                'phone' => $validated['guardian_phone'] ?? null,
                'email' => $validated['guardian_email'] ?? null,
                'occupation' => $validated['guardian_occupation'] ?? null,
                'annual_income' => $validated['guardian_annual_income'] ?? null,
                'is_emergency_contact' => true,
            ]);

            // Create Enrollment
            StudentEnrollment::create([
                'student_id' => $student->id,
                'academic_year_id' => $validated['academic_year_id'],
                'class_id' => $validated['class_id'],
                'section_id' => $validated['section_id'],
                'house_id' => $validated['house_id'] ?? null,
                'roll_number' => $validated['roll_number'] ?? null,
                'enrollment_date' => $validated['admission_date'],
                'status' => 'active',
            ]);

            return $this->successResponse(new StudentResource($student->load(['guardians', 'enrollments'])), 'Student admitted successfully', 201);
        });
    }

    /**
     * @OA\Put(
     *      path="/students/{id}",
     *      summary="Update Student Record",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Student updated")
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'admission_number' => 'sometimes|required|string|max:50|unique:students,admission_number,' . $id,
            'admission_date' => 'sometimes|required|date',
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'gender' => 'nullable|string|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'blood_group' => 'nullable|string|max:10',
            'nationality' => 'nullable|string|max:50',
            'religion' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:50',
            'email' => 'nullable|email|unique:students,email,' . $id,
            'phone' => 'nullable|string|max:25',
            'current_address' => 'nullable|string',
            'permanent_address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive,transferred,graduated,expelled',
        ]);

        $student->update($validated);
        return $this->successResponse(new StudentResource($student->load(['guardians', 'enrollments'])), 'Student updated successfully');
    }

    /**
     * @OA\Delete(
     *      path="/students/{id}",
     *      summary="Delete Student Record",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Student deleted")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return $this->successResponse(null, 'Student deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/students/{studentId}/enroll",
     *      summary="Enroll Student to Academic Session",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Enrollment recorded")
     * )
     */
    public function enroll(Request $request, int $studentId): JsonResponse
    {
        $student = Student::findOrFail($studentId);

        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'required|exists:sections,id',
            'house_id' => 'nullable|exists:houses,id',
            'roll_number' => 'nullable|string|max:50',
            'status' => 'nullable|string|in:active,promoted,retained,transferred,dropped',
        ]);

        $enrollment = StudentEnrollment::updateOrCreate(
            [
                'student_id' => $student->id,
                'academic_year_id' => $validated['academic_year_id'],
            ],
            array_merge($validated, ['enrollment_date' => now()])
        );

        return $this->successResponse($enrollment, 'Student enrolled successfully');
    }
}
