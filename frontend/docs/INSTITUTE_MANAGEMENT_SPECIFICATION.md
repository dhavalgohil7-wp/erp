# Institute Management Module — Technical Specification & Deliverables

This document fulfills the deliverables specified in **`task 1.txt`** for the complete multi-tenant **Institute Management** module.

---

## 1. Database Schema (Tables, Columns, Relations, Indexes)

All tables are multi-tenant and enforce tenancy via `institute_id`.

```sql
-- 1. Institutes Table (1.1 Institute Details)
CREATE TABLE institutes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    logo_url VARCHAR(500) NOT NULL,        -- Validated 200x200 px
    banner_url VARCHAR(500) NOT NULL,      -- Validated 300x70 px
    website VARCHAR(255) NULL,
    affiliation_code VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_institute_email (email)
);

-- 2. Sub Institutes Table (1.2 My Sub Institute)
CREATE TABLE sub_institutes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    UNIQUE KEY uq_sub_institute_code (institute_id, code),
    INDEX idx_sub_inst_status (institute_id, status)
);

-- 3. User Roles (3.1 User Roles)
CREATE TABLE user_roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    UNIQUE KEY uq_role_name_per_institute (institute_id, name)
);

-- 4. User Custom Fields Definition (3.2 User Fields)
CREATE TABLE user_custom_fields (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(150) NOT NULL,
    field_type ENUM('Text', 'Number', 'Password', 'Email', 'Date', 'Dropdown', 'Checkbox', 'Radio', 'Textarea') NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    is_unique BOOLEAN DEFAULT FALSE,
    options_string TEXT NULL, -- Comma-separated options for Dropdown/Radio/Checkbox
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE,
    UNIQUE KEY uq_field_title_per_role (institute_id, role_id, title)
);

-- 5. Academic Years (Module 4)
CREATE TABLE academic_years (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL, -- e.g. 2024-2025
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    terms_count INT DEFAULT 2,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    UNIQUE KEY uq_academic_year (institute_id, name)
);

-- 6. Departments (Module 5)
CREATE TABLE departments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL,
    head_of_dept VARCHAR(150) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    UNIQUE KEY uq_dept_code (institute_id, code)
);

-- 7. Standards / Classes (Module 6)
CREATE TABLE standards (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    stream VARCHAR(100) NULL,
    capacity INT DEFAULT 60,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    UNIQUE KEY uq_standard_code (institute_id, code)
);

-- 8. Subject Group Types (Module 7)
CREATE TABLE subject_group_types (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    UNIQUE KEY uq_subject_group_type (institute_id, name)
);

-- 9. Classrooms (Module 8)
CREATE TABLE classrooms (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    room_number VARCHAR(100) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    capacity INT DEFAULT 40,
    has_projector BOOLEAN DEFAULT FALSE,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    UNIQUE KEY uq_classroom (institute_id, room_number)
);

-- 10. Group Classrooms (Module 9)
CREATE TABLE group_classrooms (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    rooms_included TEXT NOT NULL,
    total_capacity INT DEFAULT 120,
    purpose TEXT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    UNIQUE KEY uq_group_classroom (institute_id, name)
);

-- 11. Master Subject Groups (Module 10)
CREATE TABLE master_subject_groups (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    standard_id BIGINT UNSIGNED NOT NULL,
    group_name VARCHAR(150) NOT NULL,
    group_type VARCHAR(100) NOT NULL,
    subjects_list TEXT NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    FOREIGN KEY (standard_id) REFERENCES standards(id) ON DELETE CASCADE,
    UNIQUE KEY uq_master_group (institute_id, standard_id, group_name)
);

-- 12. Users (Modules 11, 12, 13: Students, Faculties, Admin)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    default_data JSON NOT NULL, -- Core pre-defined attributes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE RESTRICT,
    INDEX idx_user_role (institute_id, role_id)
);

-- 13. Dynamic Custom Field Values (with Per-Institute Unique Constraint)
CREATE TABLE user_custom_field_values (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    field_id BIGINT UNSIGNED NOT NULL,
    field_value TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES user_custom_fields(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_field (user_id, field_id)
);
```

---

## 2. API Endpoint List (Methods, Payloads, Responses)

### 2.1 Section 1 — Account Settings
| Method | Endpoint | Description | Payload | Response |
|---|---|---|---|---|
| `GET` | `/api/v1/institute/details` | Fetch institute identity | — | `200 OK` + Institute Object |
| `PUT` | `/api/v1/institute/details` | Save & validate details (multipart/form) | Name, Address, Email, Phone, Logo, Banner | `200 OK` + Updated Details |
| `GET` | `/api/v1/sub-institutes` | List all sub institutes | query: `?search=&status=` | `200 OK` + Array of SubInstitutes |
| `POST` | `/api/v1/sub-institutes` | Add new sub institute | `{ name, code, city, status }` | `201 Created` |
| `PUT` | `/api/v1/sub-institutes/:id` | Update sub institute | `{ name, code, city, status }` | `200 OK` |
| `DELETE` | `/api/v1/sub-institutes/:id`| Delete sub institute | — | `200 OK` / `204 No Content` |
| `GET` | `/api/v1/user-roles` | Get user roles (3.1) | — | `200 OK` + Roles Array |
| `POST` | `/api/v1/user-roles` | Create new user role (3.1) | `{ name, description }` | `201 Created` |
| `GET` | `/api/v1/user-fields/:role` | Get fields for role (3.2) | — | `200 OK` + `{ defaultFields, customFields }` |
| `PUT` | `/api/v1/user-fields/:role` | Save custom fields list | `{ customFields: [...] }` | `200 OK` |

### 2.2 Section 2 — Institute Setup (Modules 4–10)
| Module | Method & Endpoint | Description |
|---|---|---|
| 4. Years | `GET/POST/PUT/DELETE /api/v1/setup/years` | Academic years CRUD |
| 5. Depts | `GET/POST/PUT/DELETE /api/v1/setup/departments` | Department CRUD |
| 6. Standards | `GET/POST/PUT/DELETE /api/v1/setup/standards` | Class / Standard CRUD |
| 7. Subject Types | `GET/POST/PUT/DELETE /api/v1/setup/subject-types` | Subject Group Types CRUD |
| 8. Classrooms | `GET/POST/PUT/DELETE /api/v1/setup/classrooms` | Classrooms CRUD |
| 9. Group Classrooms | `GET/POST/PUT/DELETE /api/v1/setup/group-classrooms` | Group Classrooms CRUD |
| 10. Master Groups | `GET/POST/PUT/DELETE /api/v1/setup/master-subject-groups` | Master Subject Grouping CRUD |

### 2.3 Section 3 — User Management (Modules 11–13)
| Method | Endpoint | Description | Payload |
|---|---|---|---|
| `GET` | `/api/v1/users?role={student\|faculties\|admin}` | List role records | query params |
| `POST` | `/api/v1/users` | Register user with dynamic custom fields | `{ roleId, defaultData, customData }` |
| `PUT` | `/api/v1/users/:id` | Update user record | `{ defaultData, customData }` |
| `DELETE` | `/api/v1/users/:id` | Delete user record | — |

---

## 3. Backend Implementation & Validation Logic

### Image Upload Dimension Validation
```ts
// Example Express / NestJS Middleware / Controller validator
import sharp from 'sharp';

export async function validateImageDimensions(file: Express.Multer.File, expectedWidth: number, expectedHeight: number) {
  const metadata = await sharp(file.buffer).metadata();
  if (metadata.width !== expectedWidth || metadata.height !== expectedHeight) {
    throw new BadRequestException(
      `Invalid image dimensions! Expected ${expectedWidth}x${expectedHeight} px, but received ${metadata.width}x${metadata.height} px.`
    );
  }
}
```

### Dynamic Custom Field Validation Engine
```ts
export async function validateCustomFields(instituteId: string, roleId: string, customData: Record<string, any>, excludeUserId?: string) {
  const fieldDefs = await CustomFieldModel.findAll({ where: { instituteId, roleId } });

  for (const def of fieldDefs) {
    const val = customData[def.title];

    // 1. Required Check
    if (def.required && (!val || String(val).trim() === '')) {
      throw new BadRequestException(`Field "${def.title}" is required.`);
    }

    // 2. Options Check for Dropdown / Radio / Checkbox
    if (['Dropdown', 'Radio'].includes(def.fieldType) && val) {
      const allowed = def.optionsString.split(',').map(s => s.trim());
      if (!allowed.includes(val)) {
        throw new BadRequestException(`Invalid option "${val}" for field "${def.title}".`);
      }
    }

    // 3. Unique Constraint Per Institute
    if (def.isUnique && val) {
      const existing = await CustomValueModel.findOne({
        where: {
          instituteId,
          fieldId: def.id,
          fieldValue: String(val).trim(),
          ...(excludeUserId ? { userId: { [Op.ne]: excludeUserId } } : {})
        }
      });
      if (existing) {
        throw new ConflictException(`Value "${val}" for unique field "${def.title}" is already registered.`);
      }
    }
  }
}
```

---

## 4. Frontend Implementation

- **Location**: `src/pages/InstitutePage.tsx`
- **Sub-components**:
  - `src/components/institute/InstituteDetailsForm.tsx`: 1.1 Details with 200x200 and 300x70 pixel check, live preview, auto-fit canvas scaler, and persistence.
  - `src/components/institute/SubInstitutesTable.tsx`: 1.2 Sub Institutes listing, modal creation, edit, status toggle, and delete confirmation dialog.
  - `src/components/institute/MasterSetupSection.tsx`: 3.1 User Roles table (Default Student role non-deletable) + 3.2 User Fields two accordions (read-only default fields + dynamic custom field table with live row add/remove).
  - `src/components/institute/InstituteSetupSection.tsx`: Modules 4–10 unified CRUD with status badges and search.
  - `src/components/institute/UserManagementSection.tsx`: Modules 11–13 dynamic forms rendering custom fields created in 3.2.
  - `src/components/institute/DynamicFieldRenderer.tsx`: Renders Text, Number, Password, Email, Date, Dropdown, Radio, Checkbox, Textarea.
  - `src/components/institute/ToastContainer.tsx`: Non-intrusive feedback toasts for all user actions.
- **State**: `src/store/useInstituteStore.ts` with local storage persistence.

---

## 5. Seeders for Default Roles & Sample Data

```sql
-- Seed Core Roles
INSERT INTO user_roles (institute_id, name, is_default, description) VALUES
(1, 'Student', TRUE, 'Enrolled student body (Core system role)'),
(1, 'Faculties', FALSE, 'Academic teaching faculty and professors'),
(1, 'Institute Admin', FALSE, 'Campus administrative leadership');

-- Seed Sample Custom Fields for Student
INSERT INTO user_custom_fields (institute_id, role_id, title, field_type, required, is_unique, options_string, order_index) VALUES
(1, 1, 'Blood Group', 'Dropdown', TRUE, FALSE, 'A+, A-, B+, B-, O+, O-, AB+, AB-', 1),
(1, 1, 'Transportation Required', 'Radio', FALSE, FALSE, 'Yes, No', 2),
(1, 1, 'Aadhaar / National ID', 'Text', TRUE, TRUE, NULL, 3);
```

---

## 6. Test Cases for Critical Flows

1. **Logo Dimension Validation**:
   - Upload 180x180 px image → System blocks submission with error: `"Dimensions must be exactly 200 × 200 px"`.
   - Upload 200x200 px image (or use Auto-Fit) → System validates and saves successfully.
2. **Banner Dimension Validation**:
   - Upload 400x100 px image → System blocks submission with error: `"Dimensions must be exactly 300 × 70 px"`.
   - Upload 300x70 px image → System validates and displays preview.
3. **Dynamic Custom Field Generation & Persistence**:
   - Navigate to 1.3 Master Setup → Select "Student" → In Accordion 2, add new row: `Title: "Hostel Room Preference"`, `Type: "Dropdown"`, `Options: "Single, Double, AC Suite"`, `Required: Yes`.
   - Click "Save Custom Fields".
   - Navigate to Section 3 (User Management) → Click "Add New Student".
   - Verify that "Hostel Room Preference" is immediately rendered with a select dropdown containing `Single`, `Double`, `AC Suite`!
4. **Unique Field Validation**:
   - Attempt to add a student with the same `Aadhaar / National ID` as an existing student.
   - System catches the duplicate and prevents submission with: `"Field Aadhaar / National ID must be unique! Value is already registered."`
