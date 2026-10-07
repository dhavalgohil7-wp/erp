<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\StaffResource;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Staff;
use App\Models\TeacherSubjectAssignment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StaffController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/staff",
     *      summary="List all Staff / Employees",
     *      tags={"Staff & Employee Records"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Paginated staff records")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Staff::with(['department', 'designation', 'reportingManager']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'ilike', "%{$search}%")
                  ->orWhere('last_name', 'ilike', "%{$search}%")
                  ->orWhere('employee_id', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('designation_id')) {
            $query->where('designation_id', $request->designation_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->input('per_page', 15);
        $staff = $query->latest()->paginate($perPage);

        return $this->paginatedResponse($staff);
    }

    /**
     * @OA\Get(
     *      path="/staff/{id}",
     *      summary="Get Staff Profile Details",
     *      tags={"Staff & Employee Records"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Staff details with documents and assignments")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $staff = Staff::with(['department', 'designation', 'reportingManager', 'subordinates', 'documents', 'teacherSubjectAssignments.schoolClass', 'teacherSubjectAssignments.section', 'teacherSubjectAssignments.subject'])->findOrFail($id);
        return $this->successResponse(new StaffResource($staff));
    }

    /**
     * @OA\Post(
     *      path="/staff",
     *      summary="Create Staff Record with optional Portal Login",
     *      tags={"Staff & Employee Records"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Staff created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institute_id' => 'required|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'employee_id' => 'required|string|max:50|unique:staff,employee_id',
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'required|email|unique:staff,email',
            'phone' => 'nullable|string|max:25',
            'gender' => 'nullable|string|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'joining_date' => 'required|date',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'reporting_manager_id' => 'nullable|exists:staff,id',
            'qualification' => 'nullable|string',
            'experience_years' => 'nullable|numeric|min:0',
            'basic_salary' => 'nullable|numeric|min:0',
            'contract_type' => 'nullable|string|in:permanent,probation,contract,visiting',
            'status' => 'nullable|string|in:active,on_leave,resigned,terminated',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
            'create_user_account' => 'nullable|boolean',
            'password' => 'nullable|string|min:8',
        ]);

        return DB::transaction(function () use ($validated) {
            $userId = null;
            if (!empty($validated['create_user_account'])) {
                $user = User::create([
                    'name' => trim("{$validated['first_name']} " . ($validated['last_name'] ?? '')),
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password'] ?? 'Staff@12345'),
                    'phone' => $validated['phone'] ?? null,
                    'user_type' => 'teacher',
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]);
                $user->assignRole('teacher');
                $userId = $user->id;
            }

            $staff = Staff::create(array_merge($validated, ['user_id' => $userId]));
            return $this->successResponse(new StaffResource($staff->load(['department', 'designation'])), 'Staff record created successfully', 201);
        });
    }

    /**
     * @OA\Put(
     *      path="/staff/{id}",
     *      summary="Update Staff Profile",
     *      tags={"Staff & Employee Records"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Staff updated")
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $staff = Staff::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'sometimes|required|email|unique:staff,email,' . $id,
            'phone' => 'nullable|string|max:25',
            'gender' => 'nullable|string|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'joining_date' => 'sometimes|required|date',
            'exit_date' => 'nullable|date|after_or_equal:joining_date',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'reporting_manager_id' => 'nullable|exists:staff,id',
            'qualification' => 'nullable|string',
            'experience_years' => 'nullable|numeric|min:0',
            'basic_salary' => 'nullable|numeric|min:0',
            'contract_type' => 'nullable|string|in:permanent,probation,contract,visiting',
            'status' => 'nullable|string|in:active,on_leave,resigned,terminated',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
        ]);

        $staff->update($validated);
        return $this->successResponse(new StaffResource($staff->load(['department', 'designation'])), 'Staff profile updated successfully');
    }

    /**
     * @OA\Delete(
     *      path="/staff/{id}",
     *      summary="Delete Staff Record",
     *      tags={"Staff & Employee Records"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Staff deleted")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $staff = Staff::findOrFail($id);
        $staff->delete();
        return $this->successResponse(null, 'Staff record deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/staff/{staffId}/assign-subject",
     *      summary="Assign Teacher to Class, Section and Subject",
     *      tags={"Staff & Employee Records"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Assignment created")
     * )
     */
    public function assignSubject(Request $request, int $staffId): JsonResponse
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        $assignment = TeacherSubjectAssignment::updateOrCreate(
            array_merge($validated, ['teacher_id' => $staffId])
        );

        return $this->successResponse($assignment, 'Teacher assignment configured successfully');
    }

    // --- Departments ---

    /**
     * @OA\Get(
     *      path="/departments",
     *      summary="List all Departments",
     *      tags={"Staff & Employee Records"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of departments")
     * )
     */
    public function departments(): JsonResponse
    {
        $departments = Department::withCount('staff')->get();
        return $this->successResponse($departments);
    }

    /**
     * @OA\Post(
     *      path="/departments",
     *      summary="Create Department",
     *      tags={"Staff & Employee Records"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Department created")
     * )
     */
    public function storeDepartment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institute_id' => 'required|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:100',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $dept = Department::create($validated);
        return $this->successResponse($dept, 'Department created successfully', 201);
    }

    // --- Designations ---

    /**
     * @OA\Get(
     *      path="/designations",
     *      summary="List all Designations",
     *      tags={"Staff & Employee Records"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of designations")
     * )
     */
    public function designations(): JsonResponse
    {
        $designations = Designation::withCount('staff')->get();
        return $this->successResponse($designations);
    }

    /**
     * @OA\Post(
     *      path="/designations",
     *      summary="Create Designation",
     *      tags={"Staff & Employee Records"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Designation created")
     * )
     */
    public function storeDesignation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institute_id' => 'required|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:100',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $desig = Designation::create($validated);
        return $this->successResponse($desig, 'Designation created successfully', 201);
    }
}
