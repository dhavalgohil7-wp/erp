================================================================================
CLOUD-READY SCHOOL MANAGEMENT ERP SYSTEM - PHASE 1
COMPLETE REST API REFERENCE & ARCHITECTURE GUIDE
================================================================================
Generated: 2026-10-07
Backend: Laravel 12 (PHP 8.2+) | Database: PostgreSQL 15 | Auth: Laravel Sanctum
RBAC: Spatie Laravel-Permission | Documentation: Swagger UI / OpenAPI 3.0
Base URL: http://localhost:8000/api/v1
Interactive Swagger UI: http://localhost:8000/api/documentation
OpenAPI Specification JSON: http://localhost:8000/docs/api-docs.json

================================================================================
1. DEFAULT SEED CREDENTIALS (PHASE 1 SEEDER)
================================================================================
Role: Super Admin
  - Email:    admin@schoolerp.com
  - Password: password123
  - Scope:    Full global permissions across all institutes and branches

Role: Campus / Institute Admin
  - Email:    campusadmin@schoolerp.com
  - Password: password123
  - Scope:    Branch administration, staff, students, classes

Role: Teacher / Faculty
  - Email:    sarah.teacher@schoolerp.com
  - Password: password123
  - Scope:    Assigned classes, subjects, student records

Role: Student
  - Email:    student.ethan@schoolerp.com
  - Password: password123
  - Scope:    Student profile, enrolled subjects

================================================================================
2. AUTHENTICATION & REQUEST HEADERS
================================================================================
Protected endpoints require the Sanctum Bearer token:
Headers:
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer <YOUR_ACCESS_TOKEN>

Standard Response Structure:
Success:
  {
    "success": true,
    "message": "Operation successful",
    "data": { ... }
  }

Paginated List:
  {
    "success": true,
    "message": "Data retrieved successfully",
    "data": [ ... ],
    "meta": {
      "current_page": 1,
      "last_page": 4,
      "per_page": 15,
      "total": 52,
      "has_more": true
    }
  }

Error:
  {
    "success": false,
    "message": "Error description",
    "errors": { ... }
  }

================================================================================
3. API ENDPOINTS BY MODULE
================================================================================

--------------------------------------------------------------------------------
MODULE 1: AUTHENTICATION & PROFILE
--------------------------------------------------------------------------------

1.1 POST /auth/login
    Auth: None (Public)
    Description: Authenticate user credentials and return Bearer token with roles.
    Request Body:
    {
      "email": "admin@schoolerp.com",
      "password": "password123"
    }
    Response (200 OK):
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "token": "1|qWf94dE...",
        "token_type": "Bearer",
        "user": {
          "id": 1,
          "name": "System Super Admin",
          "email": "admin@schoolerp.com",
          "user_type": "super_admin",
          "roles": ["super_admin"],
          "permissions": ["view_institutes", "create_institutes", ...]
        },
        "current_institute": { "id": 1, "name": "Apex International Academy Group" },
        "current_branch": { "id": 1, "name": "North Main Campus" }
      }
    }

1.2 GET /auth/me
    Auth: Bearer Token
    Description: Retrieve authenticated user profile with roles, permissions, and institute mapping.
    Response (200 OK):
    {
      "success": true,
      "message": "User profile retrieved successfully",
      "data": {
        "id": 1,
        "name": "System Super Admin",
        "email": "admin@schoolerp.com",
        "phone": "+1 555-0100",
        "user_type": "super_admin",
        "status": "active",
        "roles": ["super_admin"]
      }
    }

1.3 POST /auth/logout
    Auth: Bearer Token
    Description: Revoke current Sanctum token.
    Response (200 OK):
    {
      "success": true,
      "message": "Logged out successfully",
      "data": null
    }

1.4 PUT /auth/profile
    Auth: Bearer Token
    Description: Update personal profile name, phone number, and avatar.
    Request Body:
    {
      "name": "Super Admin Vance",
      "phone": "+1 555-0199"
    }

1.5 POST /auth/change-password
    Auth: Bearer Token
    Description: Update password securely with verification of old password.
    Request Body:
    {
      "current_password": "password123",
      "new_password": "NewSecretPassword#2026",
      "new_password_confirmation": "NewSecretPassword#2026"
    }

--------------------------------------------------------------------------------
MODULE 2: DASHBOARD & ANALYTICS
--------------------------------------------------------------------------------

2.1 GET /dashboard/kpi
    Auth: Bearer Token
    Query Parameters: branch_id (optional)
    Description: Returns high-level metrics for total students, faculty, classes, active session, and recent logs.
    Response (200 OK):
    {
      "success": true,
      "message": "Success",
      "data": {
        "kpis": {
          "total_students": 1,
          "total_staff": 2,
          "total_classes": 15,
          "total_branches": 2,
          "new_inquiries": 2,
          "total_users": 4,
          "active_academic_year": {
            "id": 1,
            "name": "2025-2026",
            "start_date": "2025-06-01",
            "end_date": "2026-05-31"
          }
        },
        "department_distribution": [
          { "name": "Science & Innovation", "staff_count": 1 },
          { "name": "Administration & Accounts", "staff_count": 1 }
        ],
        "recent_students": [ ... ],
        "recent_inquiries": [ ... ]
      }
    }

--------------------------------------------------------------------------------
MODULE 3: INSTITUTE & BRANCH MANAGEMENT
--------------------------------------------------------------------------------

3.1 GET /institutes
    Auth: Bearer Token
    Description: List all institutes with their branches count.

3.2 POST /institutes
    Auth: Bearer Token
    Description: Create new institute profile.
    Request Body:
    {
      "name": "St. Jude Global High School",
      "code": "STJ-01",
      "address": "450 Horizon Ave",
      "city": "Boston",
      "state": "Massachusetts",
      "country": "United States",
      "board_affiliation": "CBSE",
      "type": "multi_branch_institute",
      "established_year": 2010,
      "email": "contact@stjude.edu",
      "phone": "+1 617-555-0144"
    }

3.3 GET /institutes/{id}
    Auth: Bearer Token
    Description: Retrieve institute details and all associated branches.

3.4 PUT /institutes/{id}
    Auth: Bearer Token
    Description: Update institute profile information.

3.5 DELETE /institutes/{id}
    Auth: Bearer Token
    Description: Remove institute record.

3.6 GET /branches
    Auth: Bearer Token
    Query Parameters: institute_id (optional)
    Description: List branches/campuses across the institute.

3.7 POST /branches
    Auth: Bearer Token
    Description: Create a new branch/campus.
    Request Body:
    {
      "institute_id": 1,
      "name": "West Bay Campus",
      "branch_code": "BR-WEST-03",
      "address": "77 Marina Boulevard",
      "city": "San Francisco",
      "state": "California",
      "postal_code": "94123",
      "contact_person": "Dean Marcus",
      "email": "westbay@apexacademy.edu",
      "phone": "+1 415-555-0188",
      "is_main_branch": false
    }

3.8 PUT /branches/{id}
    Auth: Bearer Token
    Description: Update branch information.

3.9 DELETE /branches/{id}
    Auth: Bearer Token
    Description: Delete a branch.

--------------------------------------------------------------------------------
MODULE 4: ACADEMIC YEAR & SESSION MANAGEMENT
--------------------------------------------------------------------------------

4.1 GET /academic-years
    Auth: Bearer Token
    Query Parameters: branch_id (optional)
    Description: List academic years with term structure and promotion rules.

4.2 POST /academic-years
    Auth: Bearer Token
    Description: Create an academic year session.
    Request Body:
    {
      "institute_id": 1,
      "branch_id": 1,
      "name": "2026-2027",
      "code": "AY-26-27",
      "start_date": "2026-06-01",
      "end_date": "2027-05-31",
      "is_current": false,
      "status": "upcoming",
      "description": "Next academic cycle"
    }

4.3 GET /academic-years/{id}
    Auth: Bearer Token
    Description: Retrieve academic year details.

4.4 PUT /academic-years/{id}
    Auth: Bearer Token
    Description: Update academic year dates and title.

4.5 POST /academic-years/{id}/set-current
    Auth: Bearer Token
    Description: Atomically set this academic year as active system-wide.

4.6 DELETE /academic-years/{id}
    Auth: Bearer Token
    Description: Delete academic year.

4.7 POST /academic-years/{id}/terms
    Auth: Bearer Token
    Description: Add a term or semester to the session.
    Request Body:
    {
      "name": "Mid-Term Fall",
      "term_number": 1,
      "start_date": "2025-06-01",
      "end_date": "2025-10-15",
      "is_active": true
    }

4.8 PUT /terms/{termId}
    Auth: Bearer Token
    Description: Update term dates or active status.

4.9 DELETE /terms/{termId}
    Auth: Bearer Token
    Description: Delete a term.

4.10 PUT /academic-years/{id}/promotion-rules
     Auth: Bearer Token
     Description: Configure promotion criteria (minimum attendance & passing percentage).
     Request Body:
     {
       "min_attendance_percentage": 80.0,
       "passing_marks_percentage": 45.0,
       "auto_promotion_enabled": true,
       "rules_config": {
         "allow_grace_marks": true,
         "max_grace_marks": 5
       }
     }

--------------------------------------------------------------------------------
MODULE 5: USER & ROLE MANAGEMENT (SPATIE RBAC)
--------------------------------------------------------------------------------

5.1 GET /users
    Auth: Bearer Token
    Query Parameters: search, user_type, status, role, per_page, page
    Description: Paginated list of users with search and filter capabilities.

5.2 POST /users
    Auth: Bearer Token
    Description: Create a user account and assign Spatie role.
    Request Body:
    {
      "name": "Alice Johnson",
      "email": "alice.j@schoolerp.com",
      "password": "Password#123",
      "phone": "+1 555-0166",
      "user_type": "teacher",
      "role": "teacher",
      "institute_id": 1,
      "branch_id": 1
    }

5.3 GET /users/{id}
    Auth: Bearer Token
    Description: Detailed user record with roles and permissions.

5.4 PUT /users/{id}
    Auth: Bearer Token
    Description: Update user profile, contact, or assigned role.

5.5 PATCH /users/{id}/toggle-status
    Auth: Bearer Token
    Description: Toggle user between 'active' and 'inactive'.

5.6 DELETE /users/{id}
    Auth: Bearer Token
    Description: Delete user account.

5.7 GET /roles
    Auth: Bearer Token
    Description: List all roles with associated permissions count and user counts.

5.8 POST /roles
    Auth: Bearer Token
    Description: Create new custom role with granular permissions.
    Request Body:
    {
      "name": "exam_coordinator",
      "permissions": ["view_classes", "view_subjects", "view_students", "view_reports"]
    }

5.9 GET /roles/{id}
    Auth: Bearer Token
    Description: Retrieve role details and list of assigned permissions.

5.10 PUT /roles/{id}
     Auth: Bearer Token
     Description: Update role name and synchronize permissions.

5.11 DELETE /roles/{id}
     Auth: Bearer Token
     Description: Delete custom role.

5.12 GET /permissions
     Auth: Bearer Token
     Description: Retrieve complete catalog of system permissions grouped by module.

--------------------------------------------------------------------------------
MODULE 6: SETTINGS
--------------------------------------------------------------------------------

6.1 GET /settings
    Auth: Bearer Token
    Query Parameters: group, branch_id
    Description: Retrieve configuration list and key-value mapping dictionary.
    Response (200 OK):
    {
      "success": true,
      "data": {
        "list": [ ... ],
        "map": {
          "app_name": "Apex Cloud ERP",
          "currency": "USD",
          "currency_symbol": "$",
          "timezone": "America/New_York",
          "date_format": "YYYY-MM-DD",
          "theme_mode": "dark",
          "enable_admissions": "true"
        }
      }
    }

6.2 POST /settings/batch
    Auth: Bearer Token
    Description: Bulk update configuration parameters.
    Request Body:
    {
      "group": "general",
      "settings": {
        "app_name": "Apex Global High School ERP",
        "currency": "USD",
        "timezone": "America/New_York",
        "enable_sms_notifications": "true"
      }
    }

--------------------------------------------------------------------------------
MODULE 7: CLASS, SECTION, STREAM & HOUSE MANAGEMENT
--------------------------------------------------------------------------------

7.1 GET /classes
    Auth: Bearer Token
    Query Parameters: branch_id, stream_id
    Description: List all classes (Nursery - Grade 12) with sections and assigned subjects.

7.2 POST /classes
    Auth: Bearer Token
    Description: Create a new class/grade.
    Request Body:
    {
      "institute_id": 1,
      "branch_id": 1,
      "name": "Grade 5",
      "code": "GR-05",
      "numeric_level": 5,
      "status": "active"
    }

7.3 GET /classes/{id}
    Auth: Bearer Token
    Description: Retrieve class details with sections and subjects.

7.4 PUT /classes/{id}
    Auth: Bearer Token
    Description: Update class name or numeric grade level.

7.5 DELETE /classes/{id}
    Auth: Bearer Token
    Description: Delete a class.

7.6 POST /classes/{classId}/sections
    Auth: Bearer Token
    Description: Add a section to a class.
    Request Body:
    {
      "name": "Section C",
      "room_number": "RM-53",
      "max_capacity": 35,
      "status": "active"
    }

7.7 PUT /sections/{sectionId}
    Auth: Bearer Token
    Description: Update section name, room number, or assigned class teacher.

7.8 DELETE /sections/{sectionId}
    Auth: Bearer Token
    Description: Delete a section.

7.9 GET /streams
    Auth: Bearer Token
    Description: List academic streams (Science, Commerce, Arts, Foundation).

7.10 POST /streams
     Auth: Bearer Token
     Description: Create an academic stream.

7.11 GET /houses
     Auth: Bearer Token
     Description: List student houses/groups (Phoenix, Falcon, Cheetah, Pegasus).

7.12 POST /houses
     Auth: Bearer Token
     Description: Create a student house with color code.

--------------------------------------------------------------------------------
MODULE 8: SUBJECT MANAGEMENT
--------------------------------------------------------------------------------

8.1 GET /subjects
    Auth: Bearer Token
    Query Parameters: type, branch_id
    Description: List curriculum subjects (theory, practical, elective).

8.2 POST /subjects
    Auth: Bearer Token
    Description: Create a subject in the catalog.
    Request Body:
    {
      "institute_id": 1,
      "branch_id": 1,
      "name": "Robotics & Artificial Intelligence",
      "code": "ROB-401",
      "type": "practical",
      "credit_hours": 3.0,
      "pass_marks": 40.0,
      "max_marks": 100.0,
      "description": "Foundational robotics and sensor programming"
    }

8.3 GET /subjects/{id}
    Auth: Bearer Token
    Description: Retrieve subject details.

8.4 PUT /subjects/{id}
    Auth: Bearer Token
    Description: Update subject marks, credit hours, or type.

8.5 DELETE /subjects/{id}
    Auth: Bearer Token
    Description: Delete subject from catalog.

8.6 POST /classes/{classId}/assign-subject
    Auth: Bearer Token
    Description: Map a subject to a specific class.
    Request Body:
    {
      "subject_id": 6,
      "is_elective": true
    }

8.7 DELETE /classes/{classId}/subjects/{subjectId}
    Auth: Bearer Token
    Description: Remove subject from class curriculum.

--------------------------------------------------------------------------------
MODULE 9: STAFF & EMPLOYEE RECORDS
--------------------------------------------------------------------------------

9.1 GET /staff
    Auth: Bearer Token
    Query Parameters: search, department_id, designation_id, status, per_page, page
    Description: Paginated list of staff members with department and designation.

9.2 POST /staff
    Auth: Bearer Token
    Description: Create new staff record with optional portal user account.
    Request Body:
    {
      "institute_id": 1,
      "branch_id": 1,
      "employee_id": "EMP-2025-010",
      "first_name": "Daniel",
      "last_name": "Craig",
      "email": "daniel.craig@schoolerp.com",
      "phone": "+1 555-0210",
      "gender": "male",
      "date_of_birth": "1984-03-15",
      "joining_date": "2024-08-01",
      "department_id": 1,
      "designation_id": 3,
      "qualification": "M.Sc. in Organic Chemistry",
      "experience_years": 8.5,
      "basic_salary": 72000.00,
      "contract_type": "permanent",
      "create_user_account": true,
      "password": "Password#123"
    }

9.3 GET /staff/{id}
    Auth: Bearer Token
    Description: Retrieve staff profile details, reporting manager, documents, and teaching assignments.

9.4 PUT /staff/{id}
    Auth: Bearer Token
    Description: Update staff information.

9.5 DELETE /staff/{id}
    Auth: Bearer Token
    Description: Delete staff member.

9.6 POST /staff/{staffId}/assign-subject
    Auth: Bearer Token
    Description: Assign teacher to class, section and subject.
    Request Body:
    {
      "class_id": 11,
      "section_id": 21,
      "subject_id": 4,
      "academic_year_id": 1
    }

9.7 GET /departments
    Auth: Bearer Token
    Description: List all staff departments with employee count.

9.8 POST /departments
    Auth: Bearer Token
    Description: Create an administrative or academic department.

9.9 GET /designations
    Auth: Bearer Token
    Description: List designations/titles with employee count.

9.10 POST /designations
     Auth: Bearer Token
     Description: Create an employee designation.

--------------------------------------------------------------------------------
MODULE 10: STUDENT PROFILE & ADMISSION WORKFLOW
--------------------------------------------------------------------------------

10.1 GET /students
     Auth: Bearer Token
     Query Parameters: search, class_id, section_id, status, per_page, page
     Description: Paginated list of students with active enrollment and guardian summaries.

10.2 POST /students
     Auth: Bearer Token
     Description: Complete admission workflow: creates Student master profile, Guardian record, and Class enrollment atomically.
     Request Body:
     {
       "institute_id": 1,
       "branch_id": 1,
       "admission_number": "ADM-2025-0108",
       "admission_date": "2025-07-01",
       "first_name": "Sophia",
       "last_name": "Williams",
       "gender": "female",
       "date_of_birth": "2011-04-12",
       "blood_group": "A+",
       "nationality": "American",
       "category": "General",
       "email": "sophia.williams@example.com",
       "phone": "+1 555-0312",
       "current_address": "840 Lexington Avenue, Metropolis NY",
       "emergency_contact": "+1 555-0310",
       "academic_year_id": 1,
       "class_id": 9,
       "section_id": 17,
       "house_id": 2,
       "roll_number": "09A-14",
       "guardian_name": "James Williams",
       "guardian_relation": "Father",
       "guardian_phone": "+1 555-0310",
       "guardian_email": "james.williams@example.com",
       "guardian_occupation": "Financial Analyst",
       "guardian_annual_income": 110000.00,
       "create_user_account": true,
       "password": "Password#123"
     }

10.3 GET /students/{id}
     Auth: Bearer Token
     Description: Detailed student profile including guardians, documents, and historical enrollments.

10.4 PUT /students/{id}
     Auth: Bearer Token
     Description: Update student master record.

10.5 DELETE /students/{id}
     Auth: Bearer Token
     Description: Delete student record.

10.6 POST /students/{studentId}/enroll
     Auth: Bearer Token
     Description: Enroll student into an academic session, class, section, and house.
     Request Body:
     {
       "academic_year_id": 1,
       "class_id": 9,
       "section_id": 17,
       "house_id": 2,
       "roll_number": "09A-15",
       "status": "active"
     }

10.7 GET /admission-inquiries
     Auth: Bearer Token
     Query Parameters: status, search, per_page, page
     Description: List prospective student inquiries in the admissions CRM pipeline.

10.8 POST /admission-inquiries
     Auth: Bearer Token
     Description: Log a new student admission inquiry.
     Request Body:
     {
       "institute_id": 1,
       "branch_id": 1,
       "academic_year_id": 1,
       "student_name": "Liam Anderson",
       "guardian_name": "Arthur Anderson",
       "email": "arthur.a@example.com",
       "phone": "+1 555-0988",
       "applied_class_id": 10,
       "inquiry_date": "2025-06-20",
       "status": "new",
       "notes": "Parent inquired regarding sports facilities and transportation"
     }

10.9 GET /admission-inquiries/{id}
     Auth: Bearer Token
     Description: Retrieve admission inquiry details.

10.10 PUT /admission-inquiries/{id}
      Auth: Bearer Token
      Description: Update inquiry status (new, follow_up, converted, rejected, closed).

10.11 DELETE /admission-inquiries/{id}
      Auth: Bearer Token
      Description: Remove inquiry record.

================================================================================
4. TESTED SAMPLE WORKFLOW VIA CURL
================================================================================

Step 1: Authenticate as Super Admin
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@schoolerp.com","password":"password123"}'

Step 2: Fetch Current User Profile
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <TOKEN>"

Step 3: Fetch Dashboard KPIs
curl -X GET http://localhost:8000/api/v1/dashboard/kpi \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <TOKEN>"

Step 4: View Interactive Swagger Documentation
Open your browser and navigate to:
http://localhost:8000/api/documentation
================================================================================
END OF DOCUMENTATION
================================================================================
