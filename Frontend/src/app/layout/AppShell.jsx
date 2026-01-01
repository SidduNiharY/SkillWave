import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { useAuth } from "../providers/AuthProvider.jsx";
import { setAuthToken } from "../../api/http.js";

export default function AppShell() {
  const { token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // small UX: scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container-max py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}