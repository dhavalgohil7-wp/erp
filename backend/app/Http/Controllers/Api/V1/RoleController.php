<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/roles",
     *      summary="List all Roles with permissions count",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of roles")
     * )
     */
    public function index(): JsonResponse
    {
        $roles = Role::with(['permissions'])
            ->withCount('users')
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'guard_name' => $role->guard_name,
                    'users_count' => $role->users_count,
                    'permissions_count' => $role->permissions->count(),
                    'permissions' => $role->permissions->pluck('name'),
                    'created_at' => $role->created_at?->toIso8601String(),
                ];
            });

        return $this->successResponse($roles);
    }

    /**
     * @OA\Get(
     *      path="/roles/{id}",
     *      summary="Get Role details with all assigned permissions",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Role details")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $role = Role::with('permissions')->findOrFail($id);
        return $this->successResponse([
            'id' => $role->id,
            'name' => $role->name,
            'guard_name' => $role->guard_name,
            'permissions' => $role->permissions->pluck('name'),
        ]);
    }

    /**
     * @OA\Post(
     *      path="/roles",
     *      summary="Create Role",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=201, description="Role created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'sanctum',
        ]);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return $this->successResponse([
            'id' => $role->id,
            'name' => $role->name,
            'permissions' => $role->permissions->pluck('name'),
        ], 'Role created successfully', 201);
    }

    /**
     * @OA\Put(
     *      path="/roles/{id}",
     *      summary="Update Role and Sync Permissions",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Role updated")
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100|unique:roles,name,' . $id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        if (!empty($validated['name'])) {
            $role->name = $validated['name'];
            $role->save();
        }

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return $this->successResponse([
            'id' => $role->id,
            'name' => $role->name,
            'permissions' => $role->permissions->pluck('name'),
        ], 'Role updated successfully');
    }

    /**
     * @OA\Delete(
     *      path="/roles/{id}",
     *      summary="Delete Role",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Role deleted")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        if (in_array($role->name, ['super_admin', 'admin', 'teacher', 'student', 'parent', 'staff'])) {
            return $this->errorResponse('System predefined roles cannot be deleted.', 403);
        }
        $role->delete();
        return $this->successResponse(null, 'Role deleted successfully');
    }

    /**
     * @OA\Get(
     *      path="/permissions",
     *      summary="List all System Permissions grouped by module",
     *      tags={"User & Role Management"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Grouped permissions")
     * )
     */
    public function permissionsList(): JsonResponse
    {
        $permissions = Permission::all();

        $grouped = [];
        foreach ($permissions as $perm) {
            $parts = explode('_', $perm->name, 2);
            $group = count($parts) === 2 ? $parts[1] : 'general';
            $grouped[$group][] = [
                'id' => $perm->id,
                'name' => $perm->name,
                'action' => $parts[0],
            ];
        }

        return $this->successResponse($grouped);
    }
}
