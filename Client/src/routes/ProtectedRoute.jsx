import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ role }) {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) return <Navigate to="/login" />;

  // ✅ ADMIN skip verification
  if (
    user?.role !== "admin" &&
    user?.verification?.status !== "verified" &&
    location.pathname !== "/verify"
  ) {
    return <Navigate to="/verify" />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}