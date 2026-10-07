<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\AcademicYearResource;
use App\Models\AcademicYear;
use App\Models\PromotionRule;
use App\Models\Term;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AcademicYearController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/academic-years",
     *      summary="List all Academic Years",
     *      tags={"Academic Years & Sessions"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of academic years")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = AcademicYear::with(['terms', 'promotionRules'])->orderByDesc('start_date');

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        $academicYears = $query->get();
        return $this->successResponse(AcademicYearResource::collection($academicYears));
    }

    /**
     * @OA\Get(
     *      path="/academic-years/{id}",
     *      summary="Get Academic Year details",
     *      tags={"Academic Years & Sessions"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Academic year details")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $academicYear = AcademicYear::with(['terms', 'promotionRules'])->findOrFail($id);
        return $this->successResponse(new AcademicYearResource($academicYear));
    }

    /**
     * @OA\Post(
     *      path="/academic-years",
     *      summary="Create Academic Year",
     *      tags={"Academic Years & Sessions"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Academic year created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institute_id' => 'required|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:100',
            'code' => 'nullable|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_current' => 'nullable|boolean',
            'status' => 'nullable|string|in:active,archived,upcoming',
            'description' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            if (!empty($validated['is_current'])) {
                AcademicYear::where('institute_id', $validated['institute_id'])->update(['is_current' => false]);
            }

            $academicYear = AcademicYear::create($validated);

            // Automatically create default promotion rule
            PromotionRule::create([
                'academic_year_id' => $academicYear->id,
                'min_attendance_percentage' => 75.0,
                'passing_marks_percentage' => 40.0,
                'auto_promotion_enabled' => false,
            ]);

            return $this->successResponse(new AcademicYearResource($academicYear->load('terms', 'promotionRules')), 'Academic year created successfully', 201);
        });
    }

    /**
     * @OA\Put(
     *      path="/academic-years/{id}",
     *      summary="Update Academic Year",
     *      tags={"Academic Years & Sessions"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Academic year updated")
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $academicYear = AcademicYear::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'code' => 'nullable|string|max:50',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'is_current' => 'nullable|boolean',
            'status' => 'nullable|string|in:active,archived,upcoming',
            'description' => 'nullable|string',
        ]);

        if (!empty($validated['is_current'])) {
            AcademicYear::where('institute_id', $academicYear->institute_id)->where('id', '!=', $id)->update(['is_current' => false]);
        }

        $academicYear->update($validated);
        return $this->successResponse(new AcademicYearResource($academicYear->load('terms', 'promotionRules')), 'Academic year updated successfully');
    }

    /**
     * @OA\Post(
     *      path="/academic-years/{id}/set-current",
     *      summary="Set Academic Year as Active / Current",
     *      tags={"Academic Years & Sessions"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Academic year set as current")
     * )
     */
    public function setCurrent(int $id): JsonResponse
    {
        $academicYear = AcademicYear::findOrFail($id);

        DB::transaction(function () use ($academicYear) {
            AcademicYear::where('institute_id', $academicYear->institute_id)->update(['is_current' => false]);
            $academicYear->update(['is_current' => true, 'status' => 'active']);
        });

        return $this->successResponse(new AcademicYearResource($academicYear->load('terms', 'promotionRules')), 'Active session set successfully');
    }

    /**
     * @OA\Delete(
     *      path="/academic-years/{id}",
     *      summary="Delete Academic Year",
     *      tags={"Academic Years & Sessions"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Academic year deleted")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $academicYear = AcademicYear::findOrFail($id);
        $academicYear->delete();
        return $this->successResponse(null, 'Academic year deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/academic-years/{id}/terms",
     *      summary="Add Term to Academic Year",
     *      tags={"Academic Years & Sessions"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Term created")
     * )
     */
    public function storeTerm(Request $request, int $id): JsonResponse
    {
        $academicYear = AcademicYear::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'term_number' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'nullable|boolean',
        ]);

        if (!empty($validated['is_active'])) {
            Term::where('academic_year_id', $id)->update(['is_active' => false]);
        }

        $term = $academicYear->terms()->create($validated);
        return $this->successResponse($term, 'Term created successfully', 201);
    }

    /**
     * @OA\Put(
     *      path="/terms/{termId}",
     *      summary="Update Term",
     *      tags={"Academic Years & Sessions"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Term updated")
     * )
     */
    public function updateTerm(Request $request, int $termId): JsonResponse
    {
        $term = Term::findOrFail($termId);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'term_number' => 'sometimes|required|integer|min:1',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'is_active' => 'nullable|boolean',
        ]);

        if (!empty($validated['is_active'])) {
            Term::where('academic_year_id', $term->academic_year_id)->where('id', '!=', $termId)->update(['is_active' => false]);
        }

        $term->update($validated);
        return $this->successResponse($term, 'Term updated successfully');
    }

    /**
     * @OA\Delete(
     *      path="/terms/{termId}",
     *      summary="Delete Term",
     *      tags={"Academic Years & Sessions"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Term deleted")
     * )
     */
    public function destroyTerm(int $termId): JsonResponse
    {
        $term = Term::findOrFail($termId);
        $term->delete();
        return $this->successResponse(null, 'Term deleted successfully');
    }

    /**
     * @OA\Put(
     *      path="/academic-years/{id}/promotion-rules",
     *      summary="Update Promotion Rules",
     *      tags={"Academic Years & Sessions"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Promotion rules updated")
     * )
     */
    public function updatePromotionRules(Request $request, int $id): JsonResponse
    {
        $academicYear = AcademicYear::findOrFail($id);

        $validated = $request->validate([
            'min_attendance_percentage' => 'required|numeric|min:0|max:100',
            'passing_marks_percentage' => 'required|numeric|min:0|max:100',
            'auto_promotion_enabled' => 'required|boolean',
            'rules_config' => 'nullable|array',
        ]);

        $rules = PromotionRule::updateOrCreate(
            ['academic_year_id' => $academicYear->id],
            $validated
        );

        return $this->successResponse($rules, 'Promotion rules updated successfully');
    }
}
