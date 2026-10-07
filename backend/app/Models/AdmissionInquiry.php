<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmissionInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'institute_id',
        'branch_id',
        'academic_year_id',
        'inquiry_number',
        'student_name',
        'guardian_name',
        'email',
        'phone',
        'applied_class_id',
        'inquiry_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'inquiry_date' => 'date',
    ];

    public function appliedClass()
    {
        return $this->belongsTo(SchoolClass::class, 'applied_class_id');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
