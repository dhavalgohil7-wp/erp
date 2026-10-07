<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admission_inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institute_id')->constrained('institutes')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->string('inquiry_number')->unique();
            $table->string('student_name');
            $table->string('guardian_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->foreignId('applied_class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->date('inquiry_date');
            $table->string('status')->default('new'); // new, follow_up, converted, rejected, closed
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('institute_id')->constrained('institutes')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->string('admission_number')->unique();
            $table->date('admission_date');
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('gender')->nullable(); // male, female, other
            $table->date('date_of_birth')->nullable();
            $table->string('blood_group')->nullable();
            $table->string('nationality')->default('Indian');
            $table->string('religion')->nullable();
            $table->string('category')->default('General'); // General, OBC, SC, ST, Other
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('current_address')->nullable();
            $table->text('permanent_address')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->string('photo')->nullable();
            $table->string('status')->default('active'); // active, inactive, transferred, graduated, expelled
            $table->timestamps();
        });

        Schema::create('student_guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('guardian_type')->default('father'); // father, mother, guardian
            $table->string('name');
            $table->string('relation')->default('Father');
            $table->string('occupation')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->decimal('annual_income', 12, 2)->nullable();
            $table->boolean('is_emergency_contact')->default(false);
            $table->timestamps();
        });

        Schema::create('student_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('title');
            $table->string('document_type')->default('birth_certificate'); // birth_certificate, transfer_certificate, marksheet, address_proof, id_proof, medical
            $table->string('file_path');
            $table->integer('file_size')->nullable(); // KB
            $table->string('verified_status')->default('pending'); // pending, verified, rejected
            $table->timestamps();
        });

        Schema::create('student_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('section_id')->constrained('sections')->onDelete('cascade');
            $table->foreignId('house_id')->nullable()->constrained('houses')->nullOnDelete();
            $table->string('roll_number')->nullable();
            $table->date('enrollment_date')->nullable();
            $table->string('status')->default('active'); // active, promoted, retained, transferred, dropped
            $table->timestamps();

            $table->unique(['student_id', 'academic_year_id'], 'stu_yr_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_enrollments');
        Schema::dropIfExists('student_documents');
        Schema::dropIfExists('student_guardians');
        Schema::dropIfExists('students');
        Schema::dropIfExists('admission_inquiries');
    }
};
