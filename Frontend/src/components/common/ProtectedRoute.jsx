import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}