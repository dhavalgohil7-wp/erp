<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Designation extends Model
{
    use HasFactory;

    protected $fillable = [
        'institute_id',
        'branch_id',
        'name',
        'code',
        'description',
        'status',
    ];

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }
}
