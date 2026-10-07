<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'institute_id',
        'branch_id',
        'group',
        'key',
        'value',
        'type',
        'description',
        'is_system',
    ];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public static function getVal($key, $default = null, $branchId = null, $instituteId = null)
    {
        $query = static::where('key', $key);
        if ($branchId) {
            $query->where('branch_id', $branchId);
        } elseif ($instituteId) {
            $query->where('institute_id', $instituteId);
        }
        $record = $query->first();
        return $record ? $record->value : $default;
    }
}
