<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $currentEnrollment = $this->enrollments()->latest('id')->first();

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'institute_id' => $this->institute_id,
            'branch_id' => $this->branch_id,
            'admission_number' => $this->admission_number,
            'admission_date' => $this->admission_date?->format('Y-m-d'),
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'blood_group' => $this->blood_group,
            'nationality' => $this->nationality,
            'religion' => $this->religion,
            'category' => $this->category,
            'email' => $this->email,
            'phone' => $this->phone,
            'current_address' => $this->current_address,
            'permanent_address' => $this->permanent_address,
            'emergency_contact' => $this->emergency_contact,
            'photo' => $this->photo,
            'status' => $this->status,
            'current_enrollment' => $currentEnrollment ? [
                'academic_year_id' => $currentEnrollment->academic_year_id,
                'academic_year' => $currentEnrollment->academicYear?->name,
                'class_id' => $currentEnrollment->class_id,
                'class_name' => $currentEnrollment->schoolClass?->name,
                'section_id' => $currentEnrollment->section_id,
                'section_name' => $currentEnrollment->section?->name,
                'house_id' => $currentEnrollment->house_id,
                'house_name' => $currentEnrollment->house?->name,
                'roll_number' => $currentEnrollment->roll_number,
                'status' => $currentEnrollment->status,
            ] : null,
            'guardians' => $this->whenLoaded('guardians'),
            'documents' => $this->whenLoaded('documents'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
