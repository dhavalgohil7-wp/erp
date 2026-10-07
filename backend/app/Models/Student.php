<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'institute_id',
        'branch_id',
        'admission_number',
        'admission_date',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'blood_group',
        'nationality',
        'religion',
        'category',
        'email',
        'phone',
        'current_address',
        'permanent_address',
        'emergency_contact',
        'photo',
        'status',
    ];

    protected $casts = [
        'admission_date' => 'date',
        'date_of_birth' => 'date',
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

    public function guardians()
    {
        return $this->hasMany(StudentGuardian::class);
    }

    public function documents()
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function enrollments()
    {
        return $this->hasMany(StudentEnrollment::class);
    }

    public function latestEnrollment()
    {
        return $this->hasOne(StudentEnrollment::class)->latestOfMany();
    }
}
