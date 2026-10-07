<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'institute_id' => $this->institute_id,
            'branch_id' => $this->branch_id,
            'employee_id' => $this->employee_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'joining_date' => $this->joining_date?->format('Y-m-d'),
            'exit_date' => $this->exit_date?->format('Y-m-d'),
            'department_id' => $this->department_id,
            'department' => $this->department?->name,
            'designation_id' => $this->designation_id,
            'designation' => $this->designation?->name,
            'reporting_manager_id' => $this->reporting_manager_id,
            'reporting_manager' => $this->reportingManager?->full_name,
            'qualification' => $this->qualification,
            'experience_years' => $this->experience_years,
            'basic_salary' => $this->basic_salary,
            'contract_type' => $this->contract_type,
            'status' => $this->status,
            'address' => $this->address,
            'emergency_contact' => $this->emergency_contact,
            'documents' => $this->whenLoaded('documents'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
