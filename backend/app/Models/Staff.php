<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;

    protected $table = 'staff';

    protected $fillable = [
        'user_id',
        'institute_id',
        'branch_id',
        'employee_id',
        'department_id',
        'designation_id',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'email',
        'phone',
        'joining_date',
        'exit_date',
        'reporting_manager_id',
        'qualification',
        'experience_years',
        'basic_salary',
        'contract_type',
        'status',
        'address',
        'emergency_contact',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'joining_date' => 'date',
        'exit_date' => 'date',
        'experience_years' => 'float',
        'basic_salary' => 'float',
    ];

    protected $appends = ['full_name'];

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    public function reportingManager()
    {
        return $this->belongsTo(Staff::class, 'reporting_manager_id');
    }

    public function subordinates()
    {
        return $this->hasMany(Staff::class, 'reporting_manager_id');
    }

    public function documents()
    {
        return $this->hasMany(StaffDocument::class);
    }

    public function teacherSubjectAssignments()
    {
        return $this->hasMany(TeacherSubjectAssignment::class, 'teacher_id');
    }
}
