<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentGuardian extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'guardian_type', // father, mother, guardian
        'name',
        'relation',
        'occupation',
        'phone',
        'email',
        'annual_income',
        'is_emergency_contact',
    ];

    protected $casts = [
        'is_emergency_contact' => 'boolean',
        'annual_income' => 'float',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
