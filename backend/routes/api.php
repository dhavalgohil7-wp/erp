<?php

use App\Http\Controllers\Api\V1\AcademicYearController;
use App\Http\Controllers\Api\V1\AdmissionInquiryController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ClassController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\InstituteController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\StaffController;
use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Controllers\Api\V1\SubjectController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - V1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Health check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
            'app' => 'School ERP API v1',
            'database' => 'PostgreSQL connected',
        ]);
    });

    // Public Auth
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Authenticated Routes
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

        // Dashboard
        Route::get('/dashboard/kpi', [DashboardController::class, 'kpis']);

        // Institutes & Branches
        Route::apiResource('institutes', InstituteController::class);
        Route::get('/branches', [InstituteController::class, 'branches']);
        Route::post('/branches', [InstituteController::class, 'storeBranch']);
        Route::put('/branches/{id}', [InstituteController::class, 'updateBranch']);
        Route::delete('/branches/{id}', [InstituteController::class, 'destroyBranch']);

        // Academic Years & Sessions
        Route::apiResource('academic-years', AcademicYearController::class);
        Route::post('/academic-years/{id}/set-current', [AcademicYearController::class, 'setCurrent']);
        Route::post('/academic-years/{id}/terms', [AcademicYearController::class, 'storeTerm']);
        Route::put('/terms/{termId}', [AcademicYearController::class, 'updateTerm']);
        Route::delete('/terms/{termId}', [AcademicYearController::class, 'destroyTerm']);
        Route::put('/academic-years/{id}/promotion-rules', [AcademicYearController::class, 'updatePromotionRules']);

        // Users & Roles
        Route::apiResource('users', UserController::class);
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
        Route::apiResource('roles', RoleController::class);
        Route::get('/permissions', [RoleController::class, 'permissionsList']);

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings/batch', [SettingController::class, 'updateBatch']);

        // Classes, Sections, Streams, Houses
        Route::apiResource('classes', ClassController::class);
        Route::post('/classes/{classId}/sections', [ClassController::class, 'storeSection']);
        Route::put('/sections/{sectionId}', [ClassController::class, 'updateSection']);
        Route::delete('/sections/{sectionId}', [ClassController::class, 'destroySection']);
        Route::get('/streams', [ClassController::class, 'streams']);
        Route::post('/streams', [ClassController::class, 'storeStream']);
        Route::get('/houses', [ClassController::class, 'houses']);
        Route::post('/houses', [ClassController::class, 'storeHouse']);

        // Subjects
        Route::apiResource('subjects', SubjectController::class);
        Route::post('/classes/{classId}/assign-subject', [SubjectController::class, 'assignToClass']);
        Route::delete('/classes/{classId}/subjects/{subjectId}', [SubjectController::class, 'removeSubjectFromClass']);

        // Staff & Departments
        Route::apiResource('staff', StaffController::class);
        Route::post('/staff/{staffId}/assign-subject', [StaffController::class, 'assignSubject']);
        Route::get('/departments', [StaffController::class, 'departments']);
        Route::post('/departments', [StaffController::class, 'storeDepartment']);
        Route::get('/designations', [StaffController::class, 'designations']);
        Route::post('/designations', [StaffController::class, 'storeDesignation']);

        // Students & Admission
        Route::apiResource('students', StudentController::class);
        Route::post('/students/{studentId}/enroll', [StudentController::class, 'enroll']);
        Route::apiResource('admission-inquiries', AdmissionInquiryController::class);
    });
});
