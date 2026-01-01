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

export default function Routes() {
  return (
    <AppShell>
      <RRRoutes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/live" element={<LiveSessionsPage />} />
        <Route path="/mentorship" element={<OneOnOnePage />} />

        <Route path="/explore" element={<CatalogPage />} />
        <Route path="/courses/:id" element={<CoursePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </RRRoutes>
    </AppShell>
  );
}