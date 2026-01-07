import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider.jsx";

export default function DashboardRedirect() {
  const { user, loading, isAuthed } = useAuth();

  if (loading) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;

  const role = user?.role;

  // Mentor/Admin → mentor dashboard
  if (role === "MENTOR" || role === "ADMIN") {
    return <Navigate to="/mentor/dashboard" replace />;
  }

  // Default → student dashboard
  return <Navigate to="/student/dashboard" replace />;
}33