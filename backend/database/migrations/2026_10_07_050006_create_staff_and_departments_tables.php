<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institute_id')->constrained('institutes')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->string('name'); // Science, Mathematics, Humanities, Administration, Sports
            $table->string('code')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('designations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institute_id')->constrained('institutes')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->string('name'); // Principal, Vice Principal, Senior Teacher, Assistant Teacher, Accountant, Lab Assistant
            $table->string('code')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('institute_id')->constrained('institutes')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->string('employee_id')->unique();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->foreignId('designation_id')->nullable()->constrained('designations')->nullOnDelete();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('gender')->nullable(); // male, female, other
            $table->date('date_of_birth')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->date('joining_date');
            $table->date('exit_date')->nullable();
            $table->unsignedBigInteger('reporting_manager_id')->nullable();
            $table->string('qualification')->nullable();
            $table->decimal('experience_years', 4, 1)->default(0.0);
            $table->decimal('basic_salary', 12, 2)->nullable();
            $table->string('contract_type')->default('permanent'); // permanent, probation, contract, visiting
            $table->string('status')->default('active'); // active, on_leave, resigned, terminated
            $table->text('address')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->timestamps();
        });

        Schema::create('staff_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_id')->constrained('staff')->onDelete('cascade');
            $table->string('title');
            $table->string('document_type')->default('resume'); // resume, id_proof, contract, certificate, experience
            $table->string('file_path');
            $table->integer('file_size')->nullable(); // in KB
            $table->string('verified_status')->default('pending'); // pending, verified, rejected
            $table->timestamps();
        });

        Schema::create('teacher_subject_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('staff')->onDelete('cascade');
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('section_id')->constrained('sections')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->timestamps();

            $table->unique(['teacher_id', 'class_id', 'section_id', 'subject_id', 'academic_year_id'], 'tea_cls_sec_sub_yr_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_subject_assignments');
        Schema::dropIfExists('staff_documents');
        Schema::dropIfExists('staff');
        Schema::dropIfExists('designations');
        Schema::dropIfExists('departments');
    }
};
