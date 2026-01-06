import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider.jsx";

export default function DashboardRedirect() {
  const { user, loading, isAuthed } = useAuth();

  if (loading) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;

  const role = user?.role;

  // ✅ mentor/admin goes to mentor area
  if (role === "MENTOR" || role === "ADMIN") {
    return <Navigate to="/mentor/dashboard" replace />;
  }

  // ✅ student stays in student dashboard
  return <Navigate to="/student/dashboard" replace />;
}