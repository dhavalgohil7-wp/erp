<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'class_id' => $this->class_id,
            'class_name' => $this->schoolClass?->name,
            'name' => $this->name,
            'room_number' => $this->room_number,
            'max_capacity' => $this->max_capacity,
            'class_teacher_id' => $this->class_teacher_id,
            'class_teacher_name' => $this->classTeacher?->full_name,
            'status' => $this->status,
            'students_count' => $this->enrollments()->count(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
