<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubjectGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'institute_id',
        'branch_id',
        'class_id',
        'name',
        'description',
    ];

    public function classSubjects()
    {
        return $this->hasMany(ClassSubject::class);
    }
}
