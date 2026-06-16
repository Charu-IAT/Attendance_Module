import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getRole } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = getToken();
  const role = getRole().toLowerCase(); // Normalize role to lowercase

  if (!token) {
    // Not logged in -> Redirect to login page
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Role not authorized -> Redirect to their correct panel or login
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === 'trainer') {
      return <Navigate to="/trainer/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Authorized -> Render nested routes
  return <Outlet />;
}
