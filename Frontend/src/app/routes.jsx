import React from "react";
import { Routes as RRRoutes, Route } from "react-router-dom";
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

import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import NotFound from "../pages/NotFound.jsx";

import MentorCoursesPage from "../pages/mentor/MentorCoursesPage.jsx";
import MentorCourseCreatePage from "../pages/mentor/MentorCourseCreatePage.jsx";

import DashboardRedirect from "../components/common/DashboardRedirect.jsx";
import MentorDashboard from "../pages/mentor/MentorDashboard.jsx";

import RoleRoute from "../components/common/RoleRoute.jsx";


export default function Routes() {
  return (
    <RRRoutes>
      {/* 🔑 Layout Route */}
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

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />


        <Route
          path="/mentor/courses"
          element={
            <ProtectedRoute allowRoles={["MENTOR", "ADMIN"]}>
              <MentorCoursesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/courses/new"
          element={
            <ProtectedRoute allowRoles={["MENTOR", "ADMIN"]}>
              <MentorCourseCreatePage />
            </ProtectedRoute>
          }
        />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardRedirect />
    </ProtectedRoute>
  }
/>


<Route
  path="/mentor/dashboard"
  element={
    <RoleRoute allow={["MENTOR", "ADMIN"]}>
      <MentorDashboard />
    </RoleRoute>
  }
/>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </RRRoutes>
  );
}