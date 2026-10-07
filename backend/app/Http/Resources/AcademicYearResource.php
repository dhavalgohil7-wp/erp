<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AcademicYearResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institute_id' => $this->institute_id,
            'branch_id' => $this->branch_id,
            'name' => $this->name,
            'code' => $this->code,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'is_current' => (bool)$this->is_current,
            'status' => $this->status,
            'description' => $this->description,
            'terms' => $this->whenLoaded('terms'),
            'promotion_rules' => $this->whenLoaded('promotionRules'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
