<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    use HasFactory;

    protected $fillable = [
        'institute_id',
        'branch_id',
        'name',
        'code',
        'color_code',
        'description',
        'status',
    ];

    public function enrollments()
    {
        return $this->hasMany(StudentEnrollment::class);
    }
}
