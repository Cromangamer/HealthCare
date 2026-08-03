import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function RequireRole({ role, children }) {
  const { isAuthenticated, loading, role: currentRole } = useSelector((state) => state.firebaseLogin);
  const location = useLocation();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/signin" state={{ from: location }} replace />;
  if (currentRole !== role) return <Navigate to="/" replace />;
  return children;
}

export default RequireRole;
