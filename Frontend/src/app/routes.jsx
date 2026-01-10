import React from "react";
import { Routes as RRRoutes, Route, Navigate } from "react-router-dom";
import AppShell from "./layout/AppShell.jsx";

import HomePage from "../pages/marketing/HomePage.jsx";
import PricingPage from "../pages/marketing/PricingPage.jsx";
import LiveSessionsPage from "../pages/sessions/LiveSessionsPage.jsx";
import OneOnOnePage from "../pages/sessions/OneOnOnePage.jsx";

import CatalogPage from "../pages/catalog/CatalogPage.jsx";
import CoursePage from "../pages/catalog/CoursePage.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import AuthCallback from "../pages/auth/AuthCallback.jsx";
import Signup from "../pages/Signup.jsx";

import StudentDashboardPage from "../pages/dashboard/DashboardPage.jsx"; // student dashboard UI
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import NotFound from "../pages/NotFound.jsx";

import MentorCoursesPage from "../pages/mentor/MentorCoursesPage.jsx";
import MentorCourseCreatePage from "../pages/mentor/MentorCourseCreatePage.jsx";
import MentorDashboard from "../pages/mentor/MentorDashboard.jsx";

import DashboardRedirect from "../components/common/DashboardRedirect.jsx";

import StudentSessionsPage from "../pages/student/StudentSessionsPage.jsx";
import RoleRoute from "../components/common/RoleRoute.jsx";


import OneOnOneBookingPage from "../pages/sessions/OneOnOneBookingPage.jsx";
import MySessionsPage from "../pages/sessions/MySessionsPage.jsx";
import MentorSessionsPage from "../pages/mentor/MentorSessionsPage.jsx";

import MentorSlotsPage from "../pages/mentor/MentorSlotsPage.jsx";
import MentorBookingsPage from "../pages/mentor/MentorBookingsPage.jsx";
import MyBookingsPage from "../pages/sessions/MyBookingsPage.jsx";

export default function Routes() {
  return (
    <RRRoutes>
      <Route element={<AppShell />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/live" element={<LiveSessionsPage />} />
        <Route path="/mentorship" element={<OneOnOnePage />} />
        <Route path="/explore" element={<CatalogPage />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Single source of truth for dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Student dashboard */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowRoles={["STUDENT", "MENTOR", "ADMIN"]}>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Mentor dashboard */}
        <Route
          path="/mentor/dashboard"
          element={
            <RoleRoute allow={["MENTOR", "ADMIN"]}>
              <MentorDashboard />
            </RoleRoute>
          }
        />

        {/* Mentor courses */}
        <Route
          path="/mentor/courses"
          element={
            <RoleRoute allow={["MENTOR", "ADMIN"]}>
              <MentorCoursesPage />
            </RoleRoute>
          }
        />

        <Route
          path="/mentor/courses/new"
          element={
            <RoleRoute allow={["MENTOR", "ADMIN"]}>
              <MentorCourseCreatePage />
            </RoleRoute>
          }
        />

        <Route
          path="/student/sessions"
          element={
            <ProtectedRoute>
              <StudentSessionsPage />
            </ProtectedRoute>
          }
        />



        <Route
          path="/oneonone/book"
          element={
            <ProtectedRoute>
              <OneOnOneBookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/sessions"
          element={
            <ProtectedRoute>
              <MySessionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/sessions"
          element={
            <RoleRoute allow={["MENTOR", "ADMIN"]}>
              <MentorSessionsPage />
            </RoleRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/slots"
          element={
            <ProtectedRoute allowRoles={["MENTOR", "ADMIN"]}>
              <MentorSlotsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/bookings"
          element={
            <ProtectedRoute allowRoles={["MENTOR", "ADMIN"]}>
              <MentorBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* default */}
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/mentor" element={<Navigate to="/mentor/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </RRRoutes>
  );
}