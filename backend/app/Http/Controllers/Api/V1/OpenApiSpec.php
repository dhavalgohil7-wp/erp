<?php

namespace App\Http\Controllers\Api\V1;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Cloud School ERP Phase 1 API Documentation',
    description: 'Comprehensive RESTful APIs for School Management ERP Phase 1 - Multi-Campus, Roles, Academic Years, Classes, Students, Staff, Settings.'
)]
#[OA\Server(
    url: 'http://localhost:8000/api/v1',
    description: 'Local API Server'
)]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
)]
class OpenApiSpec
{
}
