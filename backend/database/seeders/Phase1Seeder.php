<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\AdmissionInquiry;
use App\Models\Branch;
use App\Models\ClassSubject;
use App\Models\Department;
use App\Models\Designation;
use App\Models\House;
use App\Models\Institute;
use App\Models\PromotionRule;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Setting;
use App\Models\Staff;
use App\Models\Stream;
use App\Models\Student;
use App\Models\StudentEnrollment;
use App\Models\StudentGuardian;
use App\Models\Subject;
use App\Models\TeacherSubjectAssignment;
use App\Models\Term;
use App\Models\User;
use App\Models\UserInstituteMapping;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class Phase1Seeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Roles and Permissions
        $roles = [
            'super_admin' => 'Super Administrator with complete global authority',
            'admin' => 'Campus / Institute Administrator',
            'teacher' => 'Faculty member / Academic staff',
            'student' => 'Enrolled student',
            'parent' => 'Parent or Guardian',
            'staff' => 'General non-teaching school staff',
        ];

        $permissions = [
            // Institutes & Branches
            'view_institutes', 'create_institutes', 'edit_institutes', 'delete_institutes',
            'view_branches', 'create_branches', 'edit_branches', 'delete_branches',
            // Academic Years & Sessions
            'view_academic_years', 'create_academic_years', 'edit_academic_years', 'delete_academic_years',
            // Users & Roles
            'view_users', 'create_users', 'edit_users', 'delete_users',
            'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
            // Settings
            'view_settings', 'edit_settings',
            // Classes, Sections, Streams, Houses
            'view_classes', 'create_classes', 'edit_classes', 'delete_classes',
            'view_sections', 'create_sections', 'edit_sections', 'delete_sections',
            'view_streams', 'create_streams', 'edit_streams', 'delete_streams',
            'view_houses', 'create_houses', 'edit_houses', 'delete_houses',
            // Subjects
            'view_subjects', 'create_subjects', 'edit_subjects', 'delete_subjects',
            'assign_subjects',
            // Staff & Departments
            'view_staff', 'create_staff', 'edit_staff', 'delete_staff',
            'view_departments', 'create_departments', 'edit_departments',
            'view_designations', 'create_designations', 'edit_designations',
            // Students & Admissions
            'view_students', 'create_students', 'edit_students', 'delete_students',
            'admit_students', 'promote_students',
            'view_inquiries', 'create_inquiries', 'edit_inquiries',
            // Reports & Dashboard
            'view_reports', 'view_dashboard',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'sanctum']);
        }

        $allPermissions = Permission::where('guard_name', 'sanctum')->get();

        $roleObjects = [];
        foreach ($roles as $roleName => $desc) {
            $roleObjects[$roleName] = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'sanctum']);
        }

        // Super Admin gets everything
        $roleObjects['super_admin']->syncPermissions($allPermissions);

        // Admin gets most permissions except institutes deletion
        $adminPerms = $allPermissions->filter(fn($p) => !in_array($p->name, ['delete_institutes']));
        $roleObjects['admin']->syncPermissions($adminPerms);

        // Teacher permissions
        $teacherPerms = Permission::whereIn('name', [
            'view_dashboard', 'view_classes', 'view_sections', 'view_subjects',
            'view_students', 'view_staff', 'view_academic_years',
        ])->get();
        $roleObjects['teacher']->syncPermissions($teacherPerms);

        // Student & Parent permissions
        $studentPerms = Permission::whereIn('name', [
            'view_dashboard', 'view_classes', 'view_subjects', 'view_academic_years',
        ])->get();
        $roleObjects['student']->syncPermissions($studentPerms);
        $roleObjects['parent']->syncPermissions($studentPerms);

        // Staff permissions
        $staffPerms = Permission::whereIn('name', [
            'view_dashboard', 'view_staff', 'view_students', 'view_academic_years',
        ])->get();
        $roleObjects['staff']->syncPermissions($staffPerms);

        // 2. Default Users
        $superAdminUser = User::firstOrCreate(
            ['email' => 'admin@schoolerp.com'],
            [
                'name' => 'System Super Admin',
                'phone' => '+1 555-0100',
                'user_type' => 'super_admin',
                'status' => 'active',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $superAdminUser->assignRole('super_admin');

        $campusAdminUser = User::firstOrCreate(
            ['email' => 'campusadmin@schoolerp.com'],
            [
                'name' => 'Dr. Robert Vance',
                'phone' => '+1 555-0101',
                'user_type' => 'admin',
                'status' => 'active',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $campusAdminUser->assignRole('admin');

        $teacherUser = User::firstOrCreate(
            ['email' => 'sarah.teacher@schoolerp.com'],
            [
                'name' => 'Sarah Jenkins, M.Sc.',
                'phone' => '+1 555-0102',
                'user_type' => 'teacher',
                'status' => 'active',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $teacherUser->assignRole('teacher');

        $studentUser = User::firstOrCreate(
            ['email' => 'student.ethan@schoolerp.com'],
            [
                'name' => 'Ethan Clark',
                'phone' => '+1 555-0103',
                'user_type' => 'student',
                'status' => 'active',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $studentUser->assignRole('student');

        // 3. Institute & Branches
        $institute = Institute::firstOrCreate(
            ['code' => 'APEX-GLOBAL'],
            [
                'name' => 'Apex International Academy Group',
                'logo' => '/assets/branding/logo.png',
                'address' => '742 Evergreen Academic Boulevard',
                'city' => 'Metropolis',
                'state' => 'New York',
                'postal_code' => '10001',
                'country' => 'United States',
                'contact_person' => 'Dr. Robert Vance',
                'email' => 'info@apexacademy.edu',
                'phone' => '+1 (800) 555-0199',
                'website' => 'https://apexacademy.edu',
                'board_affiliation' => 'CBSE & Cambridge International',
                'type' => 'multi_branch_institute',
                'established_year' => 2004,
                'status' => 'active',
                'settings' => [
                    'currency' => 'USD',
                    'currency_symbol' => '$',
                    'timezone' => 'America/New_York',
                    'date_format' => 'YYYY-MM-DD',
                ],
            ]
        );

        $branchNorth = Branch::firstOrCreate(
            ['branch_code' => 'BR-NORTH-01'],
            [
                'institute_id' => $institute->id,
                'name' => 'North Main Campus',
                'address' => '742 Evergreen Blvd, North Wing',
                'city' => 'Metropolis',
                'state' => 'New York',
                'postal_code' => '10001',
                'contact_person' => 'Dr. Robert Vance',
                'email' => 'north@apexacademy.edu',
                'phone' => '+1 (800) 555-0191',
                'is_main_branch' => true,
                'status' => 'active',
            ]
        );

        $branchSouth = Branch::firstOrCreate(
            ['branch_code' => 'BR-SOUTH-02'],
            [
                'institute_id' => $institute->id,
                'name' => 'South City Campus',
                'address' => '104 Silicon Valley Way',
                'city' => 'Austin',
                'state' => 'Texas',
                'postal_code' => '78701',
                'contact_person' => 'Prof. Elena Rostova',
                'email' => 'south@apexacademy.edu',
                'phone' => '+1 (800) 555-0192',
                'is_main_branch' => false,
                'status' => 'active',
            ]
        );

        // Mappings
        UserInstituteMapping::firstOrCreate([
            'user_id' => $superAdminUser->id,
            'institute_id' => $institute->id,
            'branch_id' => $branchNorth->id,
        ], [
            'role_name' => 'super_admin',
            'is_primary' => true,
            'status' => 'active',
        ]);

        UserInstituteMapping::firstOrCreate([
            'user_id' => $campusAdminUser->id,
            'institute_id' => $institute->id,
            'branch_id' => $branchNorth->id,
        ], [
            'role_name' => 'admin',
            'is_primary' => true,
            'status' => 'active',
        ]);

        UserInstituteMapping::firstOrCreate([
            'user_id' => $teacherUser->id,
            'institute_id' => $institute->id,
            'branch_id' => $branchNorth->id,
        ], [
            'role_name' => 'teacher',
            'is_primary' => true,
            'status' => 'active',
        ]);

        // 4. Academic Years & Terms
        $currentYear = AcademicYear::firstOrCreate(
            ['name' => '2025-2026', 'institute_id' => $institute->id],
            [
                'branch_id' => $branchNorth->id,
                'code' => 'AY-25-26',
                'start_date' => '2025-06-01',
                'end_date' => '2026-05-31',
                'is_current' => true,
                'status' => 'active',
                'description' => 'Current Academic Year 2025-26 with comprehensive curriculum',
            ]
        );

        $prevYear = AcademicYear::firstOrCreate(
            ['name' => '2024-2025', 'institute_id' => $institute->id],
            [
                'branch_id' => $branchNorth->id,
                'code' => 'AY-24-25',
                'start_date' => '2024-06-01',
                'end_date' => '2025-05-31',
                'is_current' => false,
                'status' => 'archived',
                'description' => 'Archived previous academic year',
            ]
        );

        // Terms
        Term::firstOrCreate([
            'academic_year_id' => $currentYear->id,
            'term_number' => 1,
        ], [
            'name' => 'First Semester (Fall)',
            'start_date' => '2025-06-01',
            'end_date' => '2025-11-30',
            'is_active' => true,
        ]);

        Term::firstOrCreate([
            'academic_year_id' => $currentYear->id,
            'term_number' => 2,
        ], [
            'name' => 'Second Semester (Spring)',
            'start_date' => '2025-12-01',
            'end_date' => '2026-05-31',
            'is_active' => false,
        ]);

        // Promotion Rules
        PromotionRule::firstOrCreate([
            'academic_year_id' => $currentYear->id,
        ], [
            'min_attendance_percentage' => 75.0,
            'passing_marks_percentage' => 40.0,
            'auto_promotion_enabled' => true,
            'rules_config' => [
                'allow_grace_marks' => true,
                'max_grace_marks' => 5,
                'require_pass_in_all_core_subjects' => true,
            ],
        ]);

        // 5. Streams & Houses
        $streams = [
            ['name' => 'General / Foundation', 'code' => 'GEN', 'description' => 'Standard elementary and middle school curriculum'],
            ['name' => 'Science (STEM)', 'code' => 'SCI', 'description' => 'Physics, Chemistry, Advanced Math & Biology / Computer Science'],
            ['name' => 'Commerce & Management', 'code' => 'COM', 'description' => 'Accountancy, Business Studies, Economics and Applied Math'],
            ['name' => 'Humanities & Arts', 'code' => 'HUM', 'description' => 'History, Political Science, Psychology and Fine Arts'],
        ];

        $streamModels = [];
        foreach ($streams as $stream) {
            $streamModels[$stream['code']] = Stream::firstOrCreate(
                ['code' => $stream['code'], 'institute_id' => $institute->id],
                array_merge($stream, ['branch_id' => $branchNorth->id, 'status' => 'active'])
            );
        }

        $houses = [
            ['name' => 'Phoenix', 'code' => 'PHX', 'color_code' => '#EF4444', 'description' => 'Symbol of passion, courage, and perseverance'],
            ['name' => 'Falcon', 'code' => 'FLC', 'color_code' => '#3B82F6', 'description' => 'Symbol of agility, sharp intellect, and focus'],
            ['name' => 'Cheetah', 'code' => 'CHT', 'color_code' => '#F59E0B', 'description' => 'Symbol of swiftness, energy, and determination'],
            ['name' => 'Pegasus', 'code' => 'PGS', 'color_code' => '#10B981', 'description' => 'Symbol of wisdom, aspiration, and creativity'],
        ];

        $houseModels = [];
        foreach ($houses as $house) {
            $houseModels[$house['code']] = House::firstOrCreate(
                ['code' => $house['code'], 'institute_id' => $institute->id],
                array_merge($house, ['branch_id' => $branchNorth->id, 'status' => 'active'])
            );
        }

        // 6. Classes and Sections
        $classList = [
            ['name' => 'Kindergarten', 'code' => 'KG', 'numeric_level' => 0, 'stream_code' => 'GEN'],
            ['name' => 'Grade 1', 'code' => 'GR-01', 'numeric_level' => 1, 'stream_code' => 'GEN'],
            ['name' => 'Grade 2', 'code' => 'GR-02', 'numeric_level' => 2, 'stream_code' => 'GEN'],
            ['name' => 'Grade 3', 'code' => 'GR-03', 'numeric_level' => 3, 'stream_code' => 'GEN'],
            ['name' => 'Grade 4', 'code' => 'GR-04', 'numeric_level' => 4, 'stream_code' => 'GEN'],
            ['name' => 'Grade 5', 'code' => 'GR-05', 'numeric_level' => 5, 'stream_code' => 'GEN'],
            ['name' => 'Grade 6', 'code' => 'GR-06', 'numeric_level' => 6, 'stream_code' => 'GEN'],
            ['name' => 'Grade 7', 'code' => 'GR-07', 'numeric_level' => 7, 'stream_code' => 'GEN'],
            ['name' => 'Grade 8', 'code' => 'GR-08', 'numeric_level' => 8, 'stream_code' => 'GEN'],
            ['name' => 'Grade 9', 'code' => 'GR-09', 'numeric_level' => 9, 'stream_code' => 'GEN'],
            ['name' => 'Grade 10', 'code' => 'GR-10', 'numeric_level' => 10, 'stream_code' => 'GEN'],
            ['name' => 'Grade 11 - Science', 'code' => 'GR-11-SCI', 'numeric_level' => 11, 'stream_code' => 'SCI'],
            ['name' => 'Grade 11 - Commerce', 'code' => 'GR-11-COM', 'numeric_level' => 11, 'stream_code' => 'COM'],
            ['name' => 'Grade 12 - Science', 'code' => 'GR-12-SCI', 'numeric_level' => 12, 'stream_code' => 'SCI'],
            ['name' => 'Grade 12 - Commerce', 'code' => 'GR-12-COM', 'numeric_level' => 12, 'stream_code' => 'COM'],
        ];

        $classModels = [];
        foreach ($classList as $c) {
            $classModel = SchoolClass::firstOrCreate(
                ['code' => $c['code'], 'institute_id' => $institute->id],
                [
                    'branch_id' => $branchNorth->id,
                    'name' => $c['name'],
                    'numeric_level' => $c['numeric_level'],
                    'stream_id' => $streamModels[$c['stream_code']]->id ?? null,
                    'status' => 'active',
                ]
            );
            $classModels[$c['code']] = $classModel;

            // Create Sections A and B for each class
            foreach (['Section A', 'Section B'] as $secName) {
                Section::firstOrCreate(
                    ['class_id' => $classModel->id, 'name' => $secName],
                    [
                        'room_number' => 'RM-' . ($c['numeric_level'] * 10 + ($secName === 'Section A' ? 1 : 2)),
                        'max_capacity' => 35,
                        'status' => 'active',
                    ]
                );
            }
        }

        // 7. Departments and Designations
        $departments = [
            ['name' => 'Science & Innovation', 'code' => 'DEP-SCI', 'description' => 'Physics, Chemistry, Biology & Computer Labs'],
            ['name' => 'Mathematics & Logic', 'code' => 'DEP-MTH', 'description' => 'Pure and Applied Mathematics'],
            ['name' => 'Languages & Humanities', 'code' => 'DEP-LANG', 'description' => 'English, World Languages and Social Sciences'],
            ['name' => 'Physical Education & Athletics', 'code' => 'DEP-PE', 'description' => 'Sports, Health and Physical Wellness'],
            ['name' => 'Administration & Accounts', 'code' => 'DEP-ADM', 'description' => 'Finance, Operations, Human Resources and Registrar'],
        ];

        $deptModels = [];
        foreach ($departments as $d) {
            $deptModels[$d['code']] = Department::firstOrCreate(
                ['code' => $d['code'], 'institute_id' => $institute->id],
                array_merge($d, ['branch_id' => $branchNorth->id, 'status' => 'active'])
            );
        }

        $designations = [
            ['name' => 'Director / Principal', 'code' => 'DES-PRN', 'description' => 'Academic and Executive head of campus'],
            ['name' => 'Vice Principal', 'code' => 'DES-VPR', 'description' => 'Operational leadership and student welfare'],
            ['name' => 'Senior PGT Teacher', 'code' => 'DES-PGT', 'description' => 'Post-graduate teacher for high school senior classes'],
            ['name' => 'TGT Teacher', 'code' => 'DES-TGT', 'description' => 'Trained graduate teacher for middle school'],
            ['name' => 'Primary PRT Teacher', 'code' => 'DES-PRT', 'description' => 'Primary school educator'],
            ['name' => 'Chief Accountant', 'code' => 'DES-ACC', 'description' => 'Finance and billing controller'],
        ];

        $desigModels = [];
        foreach ($designations as $ds) {
            $desigModels[$ds['code']] = Designation::firstOrCreate(
                ['code' => $ds['code'], 'institute_id' => $institute->id],
                array_merge($ds, ['branch_id' => $branchNorth->id, 'status' => 'active'])
            );
        }

        // 8. Staff / Employee Records
        $staff1 = Staff::firstOrCreate(
            ['employee_id' => 'EMP-2024-001'],
            [
                'user_id' => $campusAdminUser->id,
                'institute_id' => $institute->id,
                'branch_id' => $branchNorth->id,
                'department_id' => $deptModels['DEP-ADM']->id,
                'designation_id' => $desigModels['DES-PRN']->id,
                'first_name' => 'Robert',
                'last_name' => 'Vance',
                'gender' => 'male',
                'date_of_birth' => '1975-04-12',
                'email' => $campusAdminUser->email,
                'phone' => '+1 555-0101',
                'joining_date' => '2015-08-01',
                'qualification' => 'Ph.D. in Educational Leadership',
                'experience_years' => 18.5,
                'basic_salary' => 95000.00,
                'contract_type' => 'permanent',
                'status' => 'active',
                'address' => '32 Magnolia Crest, Metropolis NY',
            ]
        );

        $staffTeacher = Staff::firstOrCreate(
            ['employee_id' => 'EMP-2024-002'],
            [
                'user_id' => $teacherUser->id,
                'institute_id' => $institute->id,
                'branch_id' => $branchNorth->id,
                'department_id' => $deptModels['DEP-SCI']->id,
                'designation_id' => $desigModels['DES-PGT']->id,
                'first_name' => 'Sarah',
                'last_name' => 'Jenkins',
                'gender' => 'female',
                'date_of_birth' => '1988-09-23',
                'email' => $teacherUser->email,
                'phone' => '+1 555-0102',
                'joining_date' => '2019-07-15',
                'reporting_manager_id' => $staff1->id,
                'qualification' => 'M.Sc. in Physics & B.Ed.',
                'experience_years' => 9.0,
                'basic_salary' => 68000.00,
                'contract_type' => 'permanent',
                'status' => 'active',
                'address' => '114 Pinecrest Way, Metropolis NY',
            ]
        );

        // Assign Section Class Teacher
        $grade10A = Section::where('class_id', $classModels['GR-10']->id)->where('name', 'Section A')->first();
        if ($grade10A) {
            $grade10A->update(['class_teacher_id' => $staffTeacher->id]);
        }

        // 9. Subjects
        $subjects = [
            ['name' => 'English Language & Literature', 'code' => 'ENG-101', 'type' => 'theory', 'credit_hours' => 4.0, 'pass_marks' => 40.0, 'max_marks' => 100.0],
            ['name' => 'Pure Mathematics', 'code' => 'MTH-201', 'type' => 'theory', 'credit_hours' => 5.0, 'pass_marks' => 40.0, 'max_marks' => 100.0],
            ['name' => 'General Science & Lab', 'code' => 'SCI-101', 'type' => 'practical', 'credit_hours' => 4.0, 'pass_marks' => 40.0, 'max_marks' => 100.0],
            ['name' => 'Physics with Lab Practicum', 'code' => 'PHY-301', 'type' => 'practical', 'credit_hours' => 4.0, 'pass_marks' => 35.0, 'max_marks' => 100.0],
            ['name' => 'Chemistry & Applied Chemistry', 'code' => 'CHM-301', 'type' => 'practical', 'credit_hours' => 4.0, 'pass_marks' => 35.0, 'max_marks' => 100.0],
            ['name' => 'Computer Science & AI', 'code' => 'CS-301', 'type' => 'elective', 'credit_hours' => 3.5, 'pass_marks' => 40.0, 'max_marks' => 100.0],
            ['name' => 'Economics & Financial Literacy', 'code' => 'ECO-201', 'type' => 'theory', 'credit_hours' => 3.0, 'pass_marks' => 40.0, 'max_marks' => 100.0],
            ['name' => 'Social Studies & World History', 'code' => 'SST-101', 'type' => 'theory', 'credit_hours' => 3.0, 'pass_marks' => 40.0, 'max_marks' => 100.0],
        ];

        $subjectModels = [];
        foreach ($subjects as $sb) {
            $subjectModels[$sb['code']] = Subject::firstOrCreate(
                ['code' => $sb['code'], 'institute_id' => $institute->id],
                array_merge($sb, ['branch_id' => $branchNorth->id, 'status' => 'active'])
            );
        }

        // Map Subjects to Grade 10
        foreach (['ENG-101', 'MTH-201', 'PHY-301', 'CHM-301', 'CS-301'] as $sCode) {
            if (isset($subjectModels[$sCode]) && isset($classModels['GR-10'])) {
                ClassSubject::firstOrCreate([
                    'class_id' => $classModels['GR-10']->id,
                    'subject_id' => $subjectModels[$sCode]->id,
                ], [
                    'is_elective' => ($sCode === 'CS-301'),
                ]);
            }
        }

        // Assign Physics Teacher Assignment
        if ($grade10A && isset($subjectModels['PHY-301'])) {
            TeacherSubjectAssignment::firstOrCreate([
                'teacher_id' => $staffTeacher->id,
                'class_id' => $classModels['GR-10']->id,
                'section_id' => $grade10A->id,
                'subject_id' => $subjectModels['PHY-301']->id,
                'academic_year_id' => $currentYear->id,
            ]);
        }

        // 10. Student Profile & Admission
        $student = Student::firstOrCreate(
            ['admission_number' => 'ADM-2025-0042'],
            [
                'user_id' => $studentUser->id,
                'institute_id' => $institute->id,
                'branch_id' => $branchNorth->id,
                'admission_date' => '2025-06-15',
                'first_name' => 'Ethan',
                'last_name' => 'Clark',
                'gender' => 'male',
                'date_of_birth' => '2010-05-18',
                'blood_group' => 'O+',
                'nationality' => 'American',
                'religion' => 'Christian',
                'category' => 'General',
                'email' => $studentUser->email,
                'phone' => '+1 555-0103',
                'current_address' => '580 Park Avenue, Apt 4B, Metropolis NY',
                'permanent_address' => '580 Park Avenue, Apt 4B, Metropolis NY',
                'emergency_contact' => '+1 555-0199',
                'status' => 'active',
            ]
        );

        // Guardian
        StudentGuardian::firstOrCreate(
            ['student_id' => $student->id, 'guardian_type' => 'father'],
            [
                'name' => 'Marcus Clark',
                'relation' => 'Father',
                'occupation' => 'Architectural Engineer',
                'phone' => '+1 555-0198',
                'email' => 'marcus.clark@example.com',
                'annual_income' => 125000.00,
                'is_emergency_contact' => true,
            ]
        );

        // Student Enrollment into Grade 10 - Section A
        if ($grade10A) {
            StudentEnrollment::firstOrCreate([
                'student_id' => $student->id,
                'academic_year_id' => $currentYear->id,
            ], [
                'class_id' => $classModels['GR-10']->id,
                'section_id' => $grade10A->id,
                'house_id' => $houseModels['PHX']->id ?? null,
                'roll_number' => '10A-01',
                'enrollment_date' => '2025-06-15',
                'status' => 'active',
            ]);
        }

        // Admission Inquiries
        AdmissionInquiry::firstOrCreate(
            ['inquiry_number' => 'INQ-2025-001'],
            [
                'institute_id' => $institute->id,
                'branch_id' => $branchNorth->id,
                'academic_year_id' => $currentYear->id,
                'student_name' => 'Chloe Bennett',
                'guardian_name' => 'David Bennett',
                'email' => 'david.bennett@example.com',
                'phone' => '+1 555-0811',
                'applied_class_id' => $classModels['GR-09']->id ?? null,
                'inquiry_date' => '2025-05-10',
                'status' => 'new',
                'notes' => 'Inquiry for STEM curriculum and transport facility',
            ]
        );

        AdmissionInquiry::firstOrCreate(
            ['inquiry_number' => 'INQ-2025-002'],
            [
                'institute_id' => $institute->id,
                'branch_id' => $branchNorth->id,
                'academic_year_id' => $currentYear->id,
                'student_name' => 'Lucas Miller',
                'guardian_name' => 'Rachel Miller',
                'email' => 'rachel.m@example.com',
                'phone' => '+1 555-0812',
                'applied_class_id' => $classModels['GR-11-SCI']->id ?? null,
                'inquiry_date' => '2025-05-14',
                'status' => 'follow_up',
                'notes' => 'Transferred from overseas, requesting scholarship guidelines',
            ]
        );

        // 11. System Settings
        $defaultSettings = [
            // General
            ['group' => 'general', 'key' => 'app_name', 'value' => 'Apex Cloud ERP', 'type' => 'string'],
            ['group' => 'general', 'key' => 'institute_tagline', 'value' => 'Empowering Future Leaders with Modern Education', 'type' => 'string'],
            ['group' => 'localization', 'key' => 'currency', 'value' => 'USD', 'type' => 'string'],
            ['group' => 'localization', 'key' => 'currency_symbol', 'value' => '$', 'type' => 'string'],
            ['group' => 'localization', 'key' => 'timezone', 'value' => 'America/New_York', 'type' => 'string'],
            ['group' => 'localization', 'key' => 'date_format', 'value' => 'YYYY-MM-DD', 'type' => 'string'],
            ['group' => 'localization', 'key' => 'language', 'value' => 'en', 'type' => 'string'],
            // Module toggles
            ['group' => 'module_toggles', 'key' => 'enable_admissions', 'value' => 'true', 'type' => 'boolean'],
            ['group' => 'module_toggles', 'key' => 'enable_staff_portal', 'value' => 'true', 'type' => 'boolean'],
            ['group' => 'module_toggles', 'key' => 'enable_parent_portal', 'value' => 'true', 'type' => 'boolean'],
            ['group' => 'module_toggles', 'key' => 'enable_sms_notifications', 'value' => 'false', 'type' => 'boolean'],
            ['group' => 'module_toggles', 'key' => 'enable_2fa_policy', 'value' => 'false', 'type' => 'boolean'],
            // Branding
            ['group' => 'branding', 'key' => 'primary_color', 'value' => '#4F46E5', 'type' => 'string'],
            ['group' => 'branding', 'key' => 'accent_color', 'value' => '#06B6D4', 'type' => 'string'],
            ['group' => 'branding', 'key' => 'theme_mode', 'value' => 'dark', 'type' => 'string'],
            // SMS & Email Gateway placeholder
            ['group' => 'sms_email', 'key' => 'smtp_host', 'value' => 'smtp.mailtrap.io', 'type' => 'string'],
            ['group' => 'sms_email', 'key' => 'smtp_port', 'value' => '2525', 'type' => 'string'],
            ['group' => 'payment_gateway', 'key' => 'stripe_enabled', 'value' => 'true', 'type' => 'boolean'],
            ['group' => 'payment_gateway', 'key' => 'paypal_enabled', 'value' => 'false', 'type' => 'boolean'],
        ];

        foreach ($defaultSettings as $setting) {
            Setting::firstOrCreate([
                'institute_id' => $institute->id,
                'branch_id' => $branchNorth->id,
                'key' => $setting['key'],
            ], [
                'group' => $setting['group'],
                'value' => $setting['value'],
                'type' => $setting['type'],
                'is_system' => true,
            ]);
        }
    }
}
