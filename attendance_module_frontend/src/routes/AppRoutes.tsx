import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import Login from '../features/auth/Login';

import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../features/admin/Dashboard';
import TrainerDetails from '../features/admin/TrainerDetails';
import AdminStudentDetails from '../features/admin/StudentDetails';
import AdminCourses from '../features/admin/Course';

import TrainerLayout from '../layouts/TrainerLayout';
import TrainerDashboard from '../features/trainer/Dashboard';
import TrainerStudentDetails from '../features/trainer/StudentDetails';
import AttendanceManagement from '../features/trainer/AttendanceManagement';

import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"       element={<AdminDashboard />} />
            <Route path="trainer-details" element={<TrainerDetails />} />
            <Route path="student-details" element={<AdminStudentDetails />} />
            <Route path="courses"         element={<AdminCourses />} />
          </Route>
        </Route>

        {/* Trainer */}
        <Route element={<ProtectedRoute allowedRoles={['trainer']} />}>
          <Route path="/trainer" element={<TrainerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"             element={<TrainerDashboard />} />
            <Route path="student-details"       element={<TrainerStudentDetails />} />
            <Route path="attendance-management" element={<AttendanceManagement />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
