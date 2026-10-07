<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\SubjectResource;
use App\Models\ClassSubject;
use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubjectController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/subjects",
     *      summary="List all Subjects",
     *      tags={"Subject Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of subjects")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Subject::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        $subjects = $query->latest()->get();
        return $this->successResponse(SubjectResource::collection($subjects));
    }

    /**
     * @OA\Get(
     *      path="/subjects/{id}",
     *      summary="Get Subject Details",
     *      tags={"Subject Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Subject details")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $subject = Subject::with('classes')->findOrFail($id);
        return $this->successResponse(new SubjectResource($subject));
    }

    /**
     * @OA\Post(
     *      path="/subjects",
     *      summary="Create Subject",
     *      tags={"Subject Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Subject created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institute_id' => 'required|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:150',
            'code' => 'nullable|string|max:50',
            'type' => 'required|string|in:theory,practical,elective,co_curricular',
            'credit_hours' => 'nullable|numeric|min:0.5|max:10',
            'pass_marks' => 'nullable|numeric|min:0|max:100',
            'max_marks' => 'nullable|numeric|min:1|max:500',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $subject = Subject::create($validated);
        return $this->successResponse(new SubjectResource($subject), 'Subject created successfully', 201);
    }

    /**
     * @OA\Put(
     *      path="/subjects/{id}",
     *      summary="Update Subject",
     *      tags={"Subject Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Subject updated")
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'code' => 'nullable|string|max:50',
            'type' => 'sometimes|required|string|in:theory,practical,elective,co_curricular',
            'credit_hours' => 'nullable|numeric|min:0.5|max:10',
            'pass_marks' => 'nullable|numeric|min:0|max:100',
            'max_marks' => 'nullable|numeric|min:1|max:500',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $subject->update($validated);
        return $this->successResponse(new SubjectResource($subject), 'Subject updated successfully');
    }

    /**
     * @OA\Delete(
     *      path="/subjects/{id}",
     *      summary="Delete Subject",
     *      tags={"Subject Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Subject deleted")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();
        return $this->successResponse(null, 'Subject deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/classes/{classId}/assign-subject",
     *      summary="Assign Subject to Class",
     *      tags={"Subject Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Subject assigned to class")
     * )
     */
    public function assignToClass(Request $request, int $classId): JsonResponse
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'is_elective' => 'nullable|boolean',
        ]);

        $class = SchoolClass::findOrFail($classId);

        $classSubject = ClassSubject::updateOrCreate(
            [
                'class_id' => $class->id,
                'subject_id' => $validated['subject_id'],
            ],
            [
                'is_elective' => $validated['is_elective'] ?? false,
            ]
        );

        return $this->successResponse($classSubject, 'Subject assigned to class successfully');
    }

    /**
     * @OA\Delete(
     *      path="/classes/{classId}/subjects/{subjectId}",
     *      summary="Remove Subject from Class",
     *      tags={"Subject Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Subject removed from class")
     * )
     */
    public function removeSubjectFromClass(int $classId, int $subjectId): JsonResponse
    {
        ClassSubject::where('class_id', $classId)->where('subject_id', $subjectId)->delete();
        return $this->successResponse(null, 'Subject removed from class');
    }
}
