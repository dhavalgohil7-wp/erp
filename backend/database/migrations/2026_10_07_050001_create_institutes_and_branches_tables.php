<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('institutes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('logo')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->default('India');
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('board_affiliation')->nullable(); // CBSE, ICSE, State Board, IB, Cambridge
            $table->string('type')->default('school'); // school, college, multi_branch_institute
            $table->year('established_year')->nullable();
            $table->string('status')->default('active'); // active, inactive
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institute_id')->constrained('institutes')->onDelete('cascade');
            $table->string('name');
            $table->string('branch_code')->unique();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_main_branch')->default(false);
            $table->string('status')->default('active'); // active, inactive
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('user_institute_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('institute_id')->constrained('institutes')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->string('role_name')->default('staff');
            $table->boolean('is_primary')->default(true);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['user_id', 'institute_id', 'branch_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_institute_mappings');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('institutes');
    }
};
