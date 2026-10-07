<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'institute_id',
        'name',
        'branch_code',
        'address',
        'city',
        'state',
        'postal_code',
        'contact_person',
        'email',
        'phone',
        'is_main_branch',
        'status',
        'settings',
    ];

    protected $casts = [
        'is_main_branch' => 'boolean',
        'settings' => 'array',
    ];

    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function academicYears()
    {
        return $this->hasMany(AcademicYear::class);
    }

    public function classes()
    {
        return $this->hasMany(SchoolClass::class);
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function designations()
    {
        return $this->hasMany(Designation::class);
    }

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function settingsList()
    {
        return $this->hasMany(Setting::class);
    }
}
