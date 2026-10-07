<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_id',
        'title',
        'document_type',
        'file_path',
        'file_size',
        'verified_status',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
