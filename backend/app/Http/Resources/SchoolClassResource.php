<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchoolClassResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institute_id' => $this->institute_id,
            'branch_id' => $this->branch_id,
            'name' => $this->name,
            'code' => $this->code,
            'numeric_level' => $this->numeric_level,
            'stream_id' => $this->stream_id,
            'stream' => $this->stream?->name,
            'status' => $this->status,
            'sections_count' => $this->sections()->count(),
            'sections' => SectionResource::collection($this->whenLoaded('sections')),
            'subjects' => SubjectResource::collection($this->whenLoaded('subjects')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
