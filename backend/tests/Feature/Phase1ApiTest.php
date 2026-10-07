<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class Phase1ApiTest extends TestCase
{
    public function test_api_health_check_returns_success(): void
    {
        $response = $this->getJson('/api/v1/health');
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'healthy',
                'app' => 'School ERP API v1',
            ]);
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@schoolerp.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'token',
                    'token_type',
                    'user' => ['id', 'name', 'email', 'roles'],
                ],
            ]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@schoolerp.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_authenticated_user_can_access_dashboard_kpis(): void
    {
        $user = User::where('email', 'admin@schoolerp.com')->first();
        $this->assertNotNull($user);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/dashboard/kpi');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'kpis' => [
                        'total_students',
                        'total_staff',
                        'total_classes',
                        'total_branches',
                    ],
                    'department_distribution',
                    'recent_students',
                ],
            ]);
    }

    public function test_authenticated_user_can_list_institutes(): void
    {
        $user = User::where('email', 'admin@schoolerp.com')->first();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/institutes');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name', 'code', 'board_affiliation'],
                ],
            ]);
    }

    public function test_authenticated_user_can_list_academic_years(): void
    {
        $user = User::where('email', 'admin@schoolerp.com')->first();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/academic-years');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name', 'is_current', 'status'],
                ],
            ]);
    }

    public function test_authenticated_user_can_list_classes(): void
    {
        $user = User::where('email', 'admin@schoolerp.com')->first();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/classes');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name', 'numeric_level'],
                ],
            ]);
    }
}
