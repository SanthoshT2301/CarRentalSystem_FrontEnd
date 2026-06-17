import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'Admin') return <Navigate to="/dashboard/admin" replace />;
    if (role === 'Agent') return <Navigate to="/dashboard/agent" replace />;
    return <Navigate to="/dashboard/customer" replace />;
  }
  return children;
}
