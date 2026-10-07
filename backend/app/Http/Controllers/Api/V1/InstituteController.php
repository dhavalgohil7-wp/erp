<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\BranchResource;
use App\Http\Resources\InstituteResource;
use App\Models\Branch;
use App\Models\Institute;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstituteController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/institutes",
     *      summary="List all Institutes",
     *      tags={"Institutes & Branches"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of institutes")
     * )
     */
    public function index(): JsonResponse
    {
        $institutes = Institute::with('branches')->latest()->get();
        return $this->successResponse(InstituteResource::collection($institutes));
    }

    /**
     * @OA\Get(
     *      path="/institutes/{id}",
     *      summary="Get Institute Details",
     *      tags={"Institutes & Branches"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Institute details with branches")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $institute = Institute::with('branches')->findOrFail($id);
        return $this->successResponse(new InstituteResource($institute));
    }

    /**
     * @OA\Post(
     *      path="/institutes",
     *      summary="Create Institute",
     *      tags={"Institutes & Branches"},
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"name","code"},
     *              @OA\Property(property="name", type="string", example="Apex Global Academy"),
     *              @OA\Property(property="code", type="string", example="APEX-01"),
     *              @OA\Property(property="board_affiliation", type="string", example="CBSE"),
     *              @OA\Property(property="type", type="string", example="multi_branch_institute")
     *          )
     *      ),
     *      @OA\Response(response=201, description="Institute created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:institutes,code',
            'logo' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'country' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'website' => 'nullable|url',
            'board_affiliation' => 'nullable|string',
            'type' => 'nullable|string|in:school,college,multi_branch_institute',
            'established_year' => 'nullable|integer|min:1800|max:2100',
            'status' => 'nullable|string|in:active,inactive',
            'settings' => 'nullable|array',
        ]);

        $institute = Institute::create($validated);
        return $this->successResponse(new InstituteResource($institute), 'Institute created successfully', 201);
    }

    /**
     * @OA\Put(
     *      path="/institutes/{id}",
     *      summary="Update Institute",
     *      tags={"Institutes & Branches"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Institute updated")
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $institute = Institute::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50|unique:institutes,code,' . $id,
            'logo' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'country' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'website' => 'nullable|string',
            'board_affiliation' => 'nullable|string',
            'type' => 'nullable|string|in:school,college,multi_branch_institute',
            'established_year' => 'nullable|integer',
            'status' => 'nullable|string|in:active,inactive',
            'settings' => 'nullable|array',
        ]);

        $institute->update($validated);
        return $this->successResponse(new InstituteResource($institute), 'Institute updated successfully');
    }

    /**
     * @OA\Delete(
     *      path="/institutes/{id}",
     *      summary="Delete Institute",
     *      tags={"Institutes & Branches"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Institute deleted")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $institute = Institute::findOrFail($id);
        $institute->delete();
        return $this->successResponse(null, 'Institute deleted successfully');
    }

    /**
     * @OA\Get(
     *      path="/branches",
     *      summary="List all Branches",
     *      tags={"Institutes & Branches"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="institute_id", in="query", required=false, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="List of branches")
     * )
     */
    public function branches(Request $request): JsonResponse
    {
        $query = Branch::with('institute');
        if ($request->filled('institute_id')) {
            $query->where('institute_id', $request->institute_id);
        }
        $branches = $query->latest()->get();
        return $this->successResponse(BranchResource::collection($branches));
    }

    /**
     * @OA\Post(
     *      path="/branches",
     *      summary="Create Branch",
     *      tags={"Institutes & Branches"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Branch created")
     * )
     */
    public function storeBranch(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institute_id' => 'required|exists:institutes,id',
            'name' => 'required|string|max:255',
            'branch_code' => 'required|string|max:50|unique:branches,branch_code',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'is_main_branch' => 'nullable|boolean',
            'status' => 'nullable|string|in:active,inactive',
            'settings' => 'nullable|array',
        ]);

        $branch = Branch::create($validated);
        return $this->successResponse(new BranchResource($branch), 'Branch created successfully', 201);
    }

    /**
     * @OA\Put(
     *      path="/branches/{id}",
     *      summary="Update Branch",
     *      tags={"Institutes & Branches"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Branch updated")
     * )
     */
    public function updateBranch(Request $request, int $id): JsonResponse
    {
        $branch = Branch::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'branch_code' => 'sometimes|required|string|max:50|unique:branches,branch_code,' . $id,
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'is_main_branch' => 'nullable|boolean',
            'status' => 'nullable|string|in:active,inactive',
            'settings' => 'nullable|array',
        ]);

        $branch->update($validated);
        return $this->successResponse(new BranchResource($branch), 'Branch updated successfully');
    }

    /**
     * @OA\Delete(
     *      path="/branches/{id}",
     *      summary="Delete Branch",
     *      tags={"Institutes & Branches"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Branch deleted")
     * )
     */
    public function destroyBranch(int $id): JsonResponse
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();
        return $this->successResponse(null, 'Branch deleted successfully');
    }
}
