<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'logo',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'contact_person',
        'email',
        'phone',
        'website',
        'board_affiliation',
        'type',
        'established_year',
        'status',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'established_year' => 'integer',
    ];

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }

    public function academicYears()
    {
        return $this->hasMany(AcademicYear::class);
    }

    public function classes()
    {
        return $this->hasMany(SchoolClass::class);
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
