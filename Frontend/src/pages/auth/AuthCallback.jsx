import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../app/providers/AuthProvider.jsx";
import { motion } from "framer-motion";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Missing token in callback URL.");
      navigate("/login", { replace: true });
      return;
    }
    setToken(token);
    toast.success("Login successful!");
    navigate("/dashboard", { replace: true });
  }, [token, setToken, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-xl rounded-3xl bg-base-100 p-8 text-center shadow"
    >
      <div className="loading loading-spinner loading-lg" />
      <h2 className="mt-4 text-xl font-semibold">Signing you in…</h2>
      <p className="mt-2 text-base-content/70">Please wait a moment.</p>
    </motion.div>
  );
}