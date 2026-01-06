import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { Sparkles, ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginLocal } from "../../lib/api.js";
import { useAuth } from "../../app/providers/AuthProvider.jsx";

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const canSubmit = useMemo(() => {
    return form.email.includes("@") && form.password.length >= 6;
  }, [form.email, form.password]);

  const onGoogleLogin = () => {
    toast.message("Redirecting to Google login…");
    const base =
      import.meta.env.VITE_API_BASE ||
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:8080";
    window.location.href = `${base}/oauth2/authorization/google`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return toast.error("Enter valid email and password");

    setLoading(true);
    try {
      const res = await loginLocal({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (!res?.token) {
        toast.error("Login failed");
        return;
      }

      /**
       * IMPORTANT:
       * - store token so refresh works
       * - login(token, user) so navbar + role routing works
       */
      localStorage.setItem("skillwave_token", res.token);
      login(res.token, res.user);

      toast.success("Welcome back!");

      // If user came from a protected route, go back there
      const from = location.state?.from?.pathname || location.state?.from;

      // Role-based default landing
      const role = res?.user?.role;
      const home = role === "MENTOR" || role === "ADMIN" ? "/mentor/dashboard" : "/dashboard";

      nav(from || home, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-2">
      {/* LEFT — INFO */}
      <div className="soft-card grad-hero p-10">
        <div className="badge badge-primary badge-outline">Secure sign-in</div>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Welcome back 👋</h1>

        <p className="mt-3 text-base-content/70">
          Login with Google or your email & password.
          <br />
          Secure authentication with OAuth2 + JWT.
        </p>

        <div className="mt-6 space-y-2 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} /> OAuth2 + JWT Security
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} /> Production-grade auth flow
          </div>
        </div>

        <div className="mt-8 flex gap-2">
          <Link to="/explore">
            <Button variant="outline">Explore</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost">Pricing</Button>
          </Link>
        </div>
      </div>

      {/* RIGHT — LOGIN CARD */}
      <div className="soft-card p-10">
        <h2 className="text-2xl font-bold">Sign in</h2>
        <p className="mt-2 text-base-content/70">Use email/password or Google.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Mail size={16} className="opacity-70" />
              Email
            </label>
            <input
              type="email"
              className="input input-bordered w-full rounded-2xl"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Lock size={16} className="opacity-70" />
              Password
            </label>

            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className="input input-bordered w-full rounded-2xl pr-12"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" variant="gradient" size="lg" fullWidth loading={loading} disabled={!canSubmit || loading}>
            Sign in
          </Button>

          {/* Divider */}
          <div className="relative py-3">
            <div className="h-px w-full bg-base-300" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 px-3 text-xs text-base-content/60">
              OR
            </div>
          </div>

          {/* Google */}
          <Button variant="outline" size="md" fullWidth onClick={onGoogleLogin} disabled={loading} type="button">
            Continue with Google
          </Button>

          <div className="text-sm text-base-content/70">
            Don’t have an account?{" "}
            <Link to="/signup" className="link link-hover">
              Sign up
            </Link>
          </div>
        </form>

        <div className="mt-6 text-xs text-base-content/60">
          Google redirect URI must be:
          <div className="mt-2 rounded-xl bg-base-200 px-3 py-2 font-mono">
            http://localhost:8080/login/oauth2/code/google
          </div>
        </div>
      </div>
    </motion.div>
  );
}