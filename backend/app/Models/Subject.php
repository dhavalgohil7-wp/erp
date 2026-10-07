<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'institute_id',
        'branch_id',
        'name',
        'code',
        'type', // theory, practical, elective, co_curricular
        'credit_hours',
        'pass_marks',
        'max_marks',
        'description',
        'status',
    ];

    protected $casts = [
        'credit_hours' => 'float',
        'pass_marks' => 'float',
        'max_marks' => 'float',
    ];

    public function classes()
    {
        return $this->belongsToMany(SchoolClass::class, 'class_subjects', 'subject_id', 'class_id')
            ->withPivot('is_elective', 'subject_group_id')
            ->withTimestamps();
    }

    public function teacherSubjectAssignments()
    {
        return $this->hasMany(TeacherSubjectAssignment::class);
    }
}
