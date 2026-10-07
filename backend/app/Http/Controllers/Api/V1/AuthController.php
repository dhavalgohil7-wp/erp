<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class AuthController extends BaseApiController
{
    #[OA\Post(
        path: '/auth/login',
        summary: 'User Authentication Login',
        tags: ['Authentication']
    )]
    #[OA\Response(
        response: 200,
        description: 'Login successful with Sanctum token'
    )]
    #[OA\Response(
        response: 401,
        description: 'Invalid credentials'
    )]
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::with(['roles', 'instituteMappings.institute', 'instituteMappings.branch'])
            ->where('email', $request->email)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Invalid email or password credentials.', 401);
        }

        if ($user->status !== 'active') {
            return $this->errorResponse('Your account is currently ' . $user->status . '. Please contact your system administrator.', 403);
        }

        // Update last login
        $user->update(['last_login_at' => now()]);

        // Create Sanctum Token
        $token = $user->createToken('erp-auth-token')->plainTextToken;

        $primaryMapping = $user->instituteMappings->where('is_primary', true)->first();

        return $this->successResponse([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
            'current_institute' => $primaryMapping?->institute,
            'current_branch' => $primaryMapping?->branch,
        ], 'Login successful');
    }

    /**
     * @OA\Get(
     *      path="/auth/me",
     *      summary="Get Authenticated User Profile",
     *      tags={"Authentication"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Authenticated user profile with roles and permissions")
     * )
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['roles', 'instituteMappings.institute', 'instituteMappings.branch', 'staffProfile', 'studentProfile']);
        return $this->successResponse(new UserResource($user), 'User profile retrieved successfully');
    }

    /**
     * @OA\Post(
     *      path="/auth/logout",
     *      summary="User Logout",
     *      tags={"Authentication"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Logged out successfully")
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return $this->successResponse(null, 'Logged out successfully');
    }

    /**
     * @OA\Put(
     *      path="/auth/profile",
     *      summary="Update Profile",
     *      tags={"Authentication"},
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="name", type="string", example="System Admin"),
     *              @OA\Property(property="phone", type="string", example="+1 555-0199")
     *          )
     *      ),
     *      @OA\Response(response=200, description="Profile updated successfully")
     * )
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:25',
            'avatar' => 'nullable|string',
        ]);

        $user->update($validated);

        return $this->successResponse(new UserResource($user), 'Profile updated successfully');
    }

    /**
     * @OA\Post(
     *      path="/auth/change-password",
     *      summary="Change Password",
     *      tags={"Authentication"},
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"current_password","new_password","new_password_confirmation"},
     *              @OA\Property(property="current_password", type="string"),
     *              @OA\Property(property="new_password", type="string", minLength=8),
     *              @OA\Property(property="new_password_confirmation", type="string")
     *          )
     *      ),
     *      @OA\Response(response=200, description="Password changed successfully")
     * )
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse('Current password does not match.', 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return $this->successResponse(null, 'Password updated successfully');
    }
}
