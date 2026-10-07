<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/settings",
     *      summary="List all system and branch settings",
     *      tags={"Settings"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="List of settings")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Setting::query();

        if ($request->filled('group')) {
            $query->where('group', $request->group);
        }

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        $settings = $query->get();

        $dictionary = [];
        foreach ($settings as $s) {
            $dictionary[$s->key] = $s->value;
        }

        return $this->successResponse([
            'list' => $settings,
            'map' => $dictionary,
        ]);
    }

    /**
     * @OA\Post(
     *      path="/settings/batch",
     *      summary="Batch Update Settings",
     *      tags={"Settings"},
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="settings", type="object", example={"currency":"USD","theme_mode":"dark"})
     *          )
     *      ),
     *      @OA\Response(response=200, description="Settings updated successfully")
     * )
     */
    public function updateBatch(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'group' => 'nullable|string',
            'branch_id' => 'nullable|integer',
            'institute_id' => 'nullable|integer',
        ]);

        $group = $validated['group'] ?? 'general';
        $branchId = $validated['branch_id'] ?? null;
        $instituteId = $validated['institute_id'] ?? null;

        foreach ($validated['settings'] as $key => $value) {
            Setting::updateOrCreate(
                [
                    'key' => $key,
                    'branch_id' => $branchId,
                    'institute_id' => $instituteId,
                ],
                [
                    'value' => is_array($value) ? json_encode($value) : (string)$value,
                    'group' => $group,
                ]
            );
        }

        return $this->successResponse(null, 'Settings updated successfully');
    }
}
