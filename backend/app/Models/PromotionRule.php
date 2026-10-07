<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromotionRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'min_attendance_percentage',
        'passing_marks_percentage',
        'auto_promotion_enabled',
        'rules_config',
    ];

    protected $casts = [
        'min_attendance_percentage' => 'float',
        'passing_marks_percentage' => 'float',
        'auto_promotion_enabled' => 'boolean',
        'rules_config' => 'array',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
