import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider.jsx";

/**
 * Usage:
 * <RoleRoute allow={["MENTOR", "ADMIN"]}>
 *   <MentorDashboard />
 * </RoleRoute>
 */
export default function RoleRoute({ allow = [], children }) {
  const { isAuthed, user, loading } = useAuth();
  const loc = useLocation();

  // If your AuthProvider is still loading (ex: fetching /api/me)
  if (loading) return null; // or return a spinner component

  // Not logged in -> go login
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  const role = user?.role; // "STUDENT" | "MENTOR" | "ADMIN"

  // If no allow list, just pass through
  if (!Array.isArray(allow) || allow.length === 0) {
    return children;
  }

  // If role missing or not allowed -> send to correct home
  const allowed = role && allow.includes(role);
  if (!allowed) {
    const fallback = role === "MENTOR" || role === "ADMIN" ? "/mentor/dashboard" : "/student/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
}