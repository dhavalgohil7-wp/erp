<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\SchoolClassResource;
use App\Http\Resources\SectionResource;
use App\Models\House;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Stream;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClassController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/classes",
     *      summary="List all Classes with sections and streams",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of classes")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = SchoolClass::with(['stream', 'sections.classTeacher', 'subjects'])->orderBy('numeric_level');

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('stream_id')) {
            $query->where('stream_id', $request->stream_id);
        }

        $classes = $query->get();
        return $this->successResponse(SchoolClassResource::collection($classes));
    }

    /**
     * @OA\Get(
     *      path="/classes/{id}",
     *      summary="Get Class Details",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Class details")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $class = SchoolClass::with(['stream', 'sections.classTeacher', 'subjects'])->findOrFail($id);
        return $this->successResponse(new SchoolClassResource($class));
    }

    /**
     * @OA\Post(
     *      path="/classes",
     *      summary="Create Class",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Class created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institute_id' => 'required|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:100',
            'code' => 'nullable|string|max:50',
            'numeric_level' => 'required|integer',
            'stream_id' => 'nullable|exists:streams,id',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $class = SchoolClass::create($validated);
        return $this->successResponse(new SchoolClassResource($class), 'Class created successfully', 201);
    }

    /**
     * @OA\Put(
     *      path="/classes/{id}",
     *      summary="Update Class",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Class updated")
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $class = SchoolClass::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'code' => 'nullable|string|max:50',
            'numeric_level' => 'sometimes|required|integer',
            'stream_id' => 'nullable|exists:streams,id',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $class->update($validated);
        return $this->successResponse(new SchoolClassResource($class), 'Class updated successfully');
    }

    /**
     * @OA\Delete(
     *      path="/classes/{id}",
     *      summary="Delete Class",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Class deleted")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $class = SchoolClass::findOrFail($id);
        $class->delete();
        return $this->successResponse(null, 'Class deleted successfully');
    }

    // --- Sections ---

    /**
     * @OA\Post(
     *      path="/classes/{classId}/sections",
     *      summary="Create Section under a Class",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Section created")
     * )
     */
    public function storeSection(Request $request, int $classId): JsonResponse
    {
        $class = SchoolClass::findOrFail($classId);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'room_number' => 'nullable|string|max:50',
            'max_capacity' => 'nullable|integer|min:1',
            'class_teacher_id' => 'nullable|exists:staff,id',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $section = $class->sections()->create($validated);
        return $this->successResponse(new SectionResource($section), 'Section created successfully', 201);
    }

    /**
     * @OA\Put(
     *      path="/sections/{sectionId}",
     *      summary="Update Section",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Section updated")
     * )
     */
    public function updateSection(Request $request, int $sectionId): JsonResponse
    {
        $section = Section::findOrFail($sectionId);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'room_number' => 'nullable|string|max:50',
            'max_capacity' => 'nullable|integer|min:1',
            'class_teacher_id' => 'nullable|exists:staff,id',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $section->update($validated);
        return $this->successResponse(new SectionResource($section), 'Section updated successfully');
    }

    /**
     * @OA\Delete(
     *      path="/sections/{sectionId}",
     *      summary="Delete Section",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Section deleted")
     * )
     */
    public function destroySection(int $sectionId): JsonResponse
    {
        $section = Section::findOrFail($sectionId);
        $section->delete();
        return $this->successResponse(null, 'Section deleted successfully');
    }

    // --- Streams ---

    /**
     * @OA\Get(
     *      path="/streams",
     *      summary="List all Streams",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of streams")
     * )
     */
    public function streams(): JsonResponse
    {
        $streams = Stream::withCount('classes')->get();
        return $this->successResponse($streams);
    }

    /**
     * @OA\Post(
     *      path="/streams",
     *      summary="Create Stream",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Stream created")
     * )
     */
    public function storeStream(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institute_id' => 'required|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:100',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $stream = Stream::create($validated);
        return $this->successResponse($stream, 'Stream created successfully', 201);
    }

    // --- Houses ---

    /**
     * @OA\Get(
     *      path="/houses",
     *      summary="List all Houses / Groups",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of houses")
     * )
     */
    public function houses(): JsonResponse
    {
        $houses = House::withCount('enrollments')->get();
        return $this->successResponse($houses);
    }

    /**
     * @OA\Post(
     *      path="/houses",
     *      summary="Create House",
     *      tags={"Class & Section Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="House created")
     * )
     */
    public function storeHouse(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institute_id' => 'required|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:100',
            'code' => 'nullable|string|max:50',
            'color_code' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);

        $house = House::create($validated);
        return $this->successResponse($house, 'House created successfully', 201);
    }
}
