<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\AdmissionInquiryResource;
use App\Models\AdmissionInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdmissionInquiryController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/admission-inquiries",
     *      summary="List all Admission Inquiries",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of admission inquiries")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = AdmissionInquiry::with(['appliedClass', 'academicYear']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('student_name', 'ilike', "%{$search}%")
                  ->orWhere('guardian_name', 'ilike', "%{$search}%")
                  ->orWhere('phone', 'ilike', "%{$search}%")
                  ->orWhere('inquiry_number', 'ilike', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 15);
        $inquiries = $query->latest()->paginate($perPage);

        return $this->paginatedResponse($inquiries);
    }

    /**
     * @OA\Get(
     *      path="/admission-inquiries/{id}",
     *      summary="Get Admission Inquiry Details",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Inquiry details")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $inquiry = AdmissionInquiry::with(['appliedClass', 'academicYear'])->findOrFail($id);
        return $this->successResponse(new AdmissionInquiryResource($inquiry));
    }

    /**
     * @OA\Post(
     *      path="/admission-inquiries",
     *      summary="Create Admission Inquiry",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Inquiry logged")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institute_id' => 'required|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'student_name' => 'required|string|max:150',
            'guardian_name' => 'nullable|string|max:150',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:25',
            'applied_class_id' => 'nullable|exists:classes,id',
            'inquiry_date' => 'required|date',
            'status' => 'nullable|string|in:new,follow_up,converted,rejected,closed',
            'notes' => 'nullable|string',
        ]);

        $inquiryNumber = 'INQ-' . date('Ymd') . '-' . rand(1000, 9999);
        $inquiry = AdmissionInquiry::create(array_merge($validated, ['inquiry_number' => $inquiryNumber]));

        return $this->successResponse(new AdmissionInquiryResource($inquiry), 'Admission inquiry recorded successfully', 201);
    }

    /**
     * @OA\Put(
     *      path="/admission-inquiries/{id}",
     *      summary="Update Admission Inquiry Status / Notes",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Inquiry updated")
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $inquiry = AdmissionInquiry::findOrFail($id);

        $validated = $request->validate([
            'student_name' => 'sometimes|required|string|max:150',
            'guardian_name' => 'nullable|string|max:150',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:25',
            'applied_class_id' => 'nullable|exists:classes,id',
            'status' => 'nullable|string|in:new,follow_up,converted,rejected,closed',
            'notes' => 'nullable|string',
        ]);

        $inquiry->update($validated);
        return $this->successResponse(new AdmissionInquiryResource($inquiry), 'Inquiry updated successfully');
    }

    /**
     * @OA\Delete(
     *      path="/admission-inquiries/{id}",
     *      summary="Delete Admission Inquiry",
     *      tags={"Student Profile & Admission"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Inquiry deleted")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $inquiry = AdmissionInquiry::findOrFail($id);
        $inquiry->delete();
        return $this->successResponse(null, 'Admission inquiry deleted successfully');
    }
}
