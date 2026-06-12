import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import Login from '../features/auth/Login';

import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../features/admin/Dashboard';
import TrainerDetails from '../features/admin/TrainerDetails';
import AdminStudentDetails from '../features/admin/StudentDetails';
import AdminCourses from '../features/admin/Course';
import Reports from '../features/admin/Reports';

import TrainerLayout from '../layouts/TrainerLayout';
import TrainerDashboard from '../features/trainer/Dashboard';
import TrainerStudentDetails from '../features/trainer/StudentDetails';
import AttendanceManagement from '../features/trainer/AttendanceManagement';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"       element={<AdminDashboard />} />
          <Route path="trainer-details" element={<TrainerDetails />} />
          <Route path="student-details" element={<AdminStudentDetails />} />
          <Route path="courses"         element={<AdminCourses />} />
          <Route path="reports"         element={<Reports />} />
        </Route>

        {/* Trainer */}
        <Route path="/trainer" element={<TrainerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"             element={<TrainerDashboard />} />
          <Route path="student-details"       element={<TrainerStudentDetails />} />
          <Route path="attendance-management" element={<AttendanceManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
