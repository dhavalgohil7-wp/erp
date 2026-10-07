<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\AcademicYear;
use App\Models\AdmissionInquiry;
use App\Models\Branch;
use App\Models\Department;
use App\Models\SchoolClass;
use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends BaseApiController
{
    /**
     * @OA\Get(
     *      path="/dashboard/kpi",
     *      summary="Get Phase 1 Dashboard KPIs and Overview Analytics",
     *      tags={"Dashboard"},
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(response=200, description="Overview statistics")
     * )
     */
    public function kpis(Request $request): JsonResponse
    {
        $branchId = $request->query('branch_id');

        $activeYear = AcademicYear::where('is_current', true)->first();

        $studentQuery = Student::query();
        $staffQuery = Staff::query();
        $inquiryQuery = AdmissionInquiry::query();

        if ($branchId) {
            $studentQuery->where('branch_id', $branchId);
            $staffQuery->where('branch_id', $branchId);
            $inquiryQuery->where('branch_id', $branchId);
        }

        $totalStudents = (clone $studentQuery)->where('status', 'active')->count();
        $totalStaff = (clone $staffQuery)->where('status', 'active')->count();
        $totalClasses = SchoolClass::where('status', 'active')->count();
        $totalBranches = Branch::where('status', 'active')->count();
        $newInquiries = (clone $inquiryQuery)->where('status', 'new')->count();
        $totalUsers = User::where('status', 'active')->count();

        // Department Breakdown
        $departmentStats = Department::withCount('staff')->get()->map(function ($dept) {
            return [
                'name' => $dept->name,
                'staff_count' => $dept->staff_count,
            ];
        });

        // Recent Admissions
        $recentStudents = (clone $studentQuery)->latest()->take(5)->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'admission_number' => $s->admission_number,
                'name' => $s->full_name,
                'admission_date' => $s->admission_date?->format('Y-m-d'),
                'gender' => $s->gender,
                'status' => $s->status,
            ];
        });

        // Recent Inquiries
        $recentInquiries = (clone $inquiryQuery)->latest()->take(5)->get()->map(function ($inq) {
            return [
                'id' => $inq->id,
                'inquiry_number' => $inq->inquiry_number,
                'student_name' => $inq->student_name,
                'guardian_name' => $inq->guardian_name,
                'phone' => $inq->phone,
                'status' => $inq->status,
                'date' => $inq->inquiry_date?->format('Y-m-d'),
            ];
        });

        return $this->successResponse([
            'kpis' => [
                'total_students' => $totalStudents,
                'total_staff' => $totalStaff,
                'total_classes' => $totalClasses,
                'total_branches' => $totalBranches,
                'new_inquiries' => $newInquiries,
                'total_users' => $totalUsers,
                'active_academic_year' => $activeYear ? [
                    'id' => $activeYear->id,
                    'name' => $activeYear->name,
                    'start_date' => $activeYear->start_date?->format('Y-m-d'),
                    'end_date' => $activeYear->end_date?->format('Y-m-d'),
                ] : null,
            ],
            'department_distribution' => $departmentStats,
            'recent_students' => $recentStudents,
            'recent_inquiries' => $recentInquiries,
        ]);
    }
}
