<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\UserInstituteMapping;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/users",
     *      summary="List all Users",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Paginated users list")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with(['roles', 'instituteMappings.branch']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%")
                  ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('user_type')) {
            $query->where('user_type', $request->user_type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('role')) {
            $query->role($request->role);
        }

        $perPage = $request->input('per_page', 15);
        $users = $query->latest()->paginate($perPage);

        return $this->paginatedResponse($users);
    }

    /**
     * @OA\Get(
     *      path="/users/{id}",
     *      summary="Get User Details",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="User details")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $user = User::with(['roles', 'instituteMappings.institute', 'instituteMappings.branch', 'staffProfile', 'studentProfile'])->findOrFail($id);
        return $this->successResponse(new UserResource($user));
    }

    /**
     * @OA\Post(
     *      path="/users",
     *      summary="Create User",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="User created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:25',
            'user_type' => 'required|string|in:super_admin,admin,teacher,student,parent,staff',
            'status' => 'nullable|string|in:active,inactive,suspended',
            'role' => 'required|string|exists:roles,name',
            'institute_id' => 'nullable|exists:institutes,id',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        return DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'user_type' => $validated['user_type'],
                'status' => $validated['status'] ?? 'active',
                'email_verified_at' => now(),
            ]);

            $user->assignRole($validated['role']);

            if (!empty($validated['institute_id'])) {
                UserInstituteMapping::create([
                    'user_id' => $user->id,
                    'institute_id' => $validated['institute_id'],
                    'branch_id' => $validated['branch_id'] ?? null,
                    'role_name' => $validated['role'],
                    'is_primary' => true,
                    'status' => 'active',
                ]);
            }

            return $this->successResponse(new UserResource($user->load('roles', 'instituteMappings')), 'User created successfully', 201);
        });
    }

    /**
     * @OA\Put(
     *      path="/users/{id}",
     *      summary="Update User",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="User updated")
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:25',
            'user_type' => 'sometimes|required|string|in:super_admin,admin,teacher,student,parent,staff',
            'status' => 'nullable|string|in:active,inactive,suspended',
            'role' => 'nullable|string|exists:roles,name',
            'password' => 'nullable|string|min:8',
        ]);

        return DB::transaction(function () use ($user, $validated) {
            $updateData = [
                'name' => $validated['name'] ?? $user->name,
                'email' => $validated['email'] ?? $user->email,
                'phone' => $validated['phone'] ?? $user->phone,
                'user_type' => $validated['user_type'] ?? $user->user_type,
                'status' => $validated['status'] ?? $user->status,
            ];

            if (!empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $user->update($updateData);

            if (!empty($validated['role'])) {
                $user->syncRoles([$validated['role']]);
            }

            return $this->successResponse(new UserResource($user->load('roles', 'instituteMappings')), 'User updated successfully');
        });
    }

    /**
     * @OA\Patch(
     *      path="/users/{id}/toggle-status",
     *      summary="Toggle User Active Status",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="User status updated")
     * )
     */
    public function toggleStatus(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->status = ($user->status === 'active') ? 'inactive' : 'active';
        $user->save();

        return $this->successResponse(new UserResource($user), "User status changed to {$user->status}");
    }

    /**
     * @OA\Delete(
     *      path="/users/{id}",
     *      summary="Delete User",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="User deleted")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();
        return $this->successResponse(null, 'User deleted successfully');
    }
}
