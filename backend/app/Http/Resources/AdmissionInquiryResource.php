<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdmissionInquiryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institute_id' => $this->institute_id,
            'branch_id' => $this->branch_id,
            'academic_year_id' => $this->academic_year_id,
            'academic_year' => $this->academicYear?->name,
            'inquiry_number' => $this->inquiry_number,
            'student_name' => $this->student_name,
            'guardian_name' => $this->guardian_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'applied_class_id' => $this->applied_class_id,
            'applied_class' => $this->appliedClass?->name,
            'inquiry_date' => $this->inquiry_date?->format('Y-m-d'),
            'status' => $this->status,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
