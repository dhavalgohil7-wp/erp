import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { InstitutesPage } from './pages/institutes/InstitutesPage';
import { AcademicYearsPage } from './pages/academics/AcademicYearsPage';
import { ClassesPage } from './pages/classes/ClassesPage';
import { SubjectsPage } from './pages/subjects/SubjectsPage';
import { StaffPage } from './pages/staff/StaffPage';
import { StudentsPage } from './pages/students/StudentsPage';
import { AdmissionInquiryPage } from './pages/students/AdmissionInquiryPage';
import { UsersPage } from './pages/users/UsersPage';
import { RolesPage } from './pages/users/RolesPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { ApiDocsPage } from './pages/docs/ApiDocsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard & Phase 1 Modules */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/institutes" element={<InstitutesPage />} />
          <Route path="/academics" element={<AcademicYearsPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/inquiries" element={<AdmissionInquiryPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/api-docs" element={<ApiDocsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
