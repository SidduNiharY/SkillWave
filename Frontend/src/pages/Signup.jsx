import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Mail,
  User2,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { signupLocal } from "../lib/api.js";
import { useAuth } from "../app/providers/AuthProvider.jsx";

/** -------------------------------------------------------
 * Premium Input (floating label + icon + error + hints)
 * ------------------------------------------------------*/
function PremiumInput({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  error,
  hint,
  inputMode,
  name,
}) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

  const isPassword = type === "password";
  const actualType = isPassword ? (show ? "text" : "password") : type;

  const hasValue = String(value ?? "").length > 0;
  const float = focused || hasValue;

  return (
    <div className="w-full">
      <div
        className={[
          "relative rounded-2xl border bg-base-100 transition",
          "shadow-[0_10px_30px_-28px_rgba(0,0,0,0.55)]",
          error
            ? "border-error/60 focus-within:border-error focus-within:ring-2 focus-within:ring-error/20"
            : "border-base-300 focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/15",
          disabled ? "opacity-70" : "",
        ].join(" ")}
      >
        {/* left icon */}
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-70">
          {icon}
        </div>

        {/* floating label */}
        <div
          className={[
            "absolute left-12 pr-10 transition-all",
            float
              ? "top-2 text-[11px] font-semibold text-base-content/60"
              : "top-1/2 -translate-y-1/2 text-sm font-semibold text-base-content/60",
          ].join(" ")}
        >
          {label}
        </div>

        <input
          name={name}
          type={actualType}
          value={value}
          placeholder={float ? placeholder : ""}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
          className={[
            "w-full rounded-2xl bg-transparent",
            "pt-6 pb-3 pl-12 pr-12",
            "outline-none text-sm font-medium",
            "placeholder:text-base-content/35",
          ].join(" ")}
        />

        {/* right action */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 opacity-70 hover:opacity-100 hover:bg-base-200/60 transition"
            aria-label={show ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : null}

        {/* error icon */}
        {!isPassword && error ? (
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-error">
            <AlertCircle size={18} />
          </div>
        ) : null}
      </div>

      {/* helper row */}
      <div className="mt-2 min-h-[18px]">
        {error ? (
          <div className="text-xs text-error font-semibold">{error}</div>
        ) : hint ? (
          <div className="text-xs text-base-content/60">{hint}</div>
        ) : null}
      </div>
    </div>
  );
}

/** -------------------------------------------------------
 * Role Picker (Student vs Mentor)
 * ------------------------------------------------------*/
function RolePicker({ value, onChange, disabled }) {
  const options = [
    {
      key: "STUDENT",
      title: "Student",
      desc: "Learn courses + join mentorship",
      icon: <Sparkles size={18} />,
    },
    {
      key: "MENTOR",
      title: "Mentor",
      desc: "Create courses, mentor & earn",
      icon: <GraduationCap size={18} />,
    },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o.key)}
            className={[
              "rounded-2xl border p-4 text-left transition",
              active
                ? "border-primary bg-primary/10"
                : "border-base-300 hover:bg-base-200/50",
              disabled ? "opacity-60" : "",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div
                className={[
                  "grid h-10 w-10 place-items-center rounded-2xl",
                  active ? "bg-primary text-primary-content" : "bg-base-200",
                ].join(" ")}
              >
                {o.icon}
              </div>
              <div className="flex-1">
                <div className="font-bold">{o.title}</div>
                <div className="text-sm text-base-content/70">{o.desc}</div>
                <div className="mt-2 text-xs text-base-content/60">
                  Role: {o.key}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function Signup() {
  const nav = useNavigate();
  const { login } = useAuth(); // ✅ if your AuthProvider supports it
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    role: "STUDENT", // ✅ default role
    name: "",
    email: "",
    password: "",
  });

  // simple validations (inline, professional UX)
  const errors = useMemo(() => {
    const e = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const pwd = form.password;

    if (name && name.length < 2) e.name = "Name must be at least 2 characters.";
    if (email && !email.includes("@")) e.email = "Enter a valid email.";
    if (pwd && pwd.length < 6)
      e.password = "Password must be at least 6 characters.";

    return e;
  }, [form]);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      form.email.includes("@") &&
      form.password.length >= 6 &&
      Object.keys(errors).length === 0
    );
  }, [form, errors]);

  const strength = useMemo(() => {
    const p = form.password || "";
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 5);
  }, [form.password]);

  const strengthText =
    strength <= 1
      ? "Weak"
      : strength === 2
      ? "Okay"
      : strength === 3
      ? "Good"
      : strength === 4
      ? "Strong"
      : "Very strong";

  const openGoogle = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE || "http://localhost:8080"
    }/oauth2/authorization/google`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      toast.error("Fix the form errors and try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await signupLocal({
        role: form.role, // ✅ SEND ROLE
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      // ✅ best: let AuthProvider store token + user (if supported)
      if (res?.token) {
        login?.(res.token, res.user); // works if your provider supports login(token,user)
        localStorage.setItem("skillwave_token", res.token);
      }

      toast.success(res?.message || "Account created!");

      // ✅ Role-based redirect (real separation)
      const role = res?.user?.role || form.role;
      if (role === "MENTOR") nav("/mentor/onboarding");
      else nav("/dashboard");
    } catch (err) {
      toast.error(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-base-100/30 to-transparent" />
      </div>

      <div className="container-max py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left - pitch */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 170, damping: 18 }}
            className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-8 shadow-sm"
          >
            <div className="absolute inset-0 opacity-70 pointer-events-none">
              <div className="h-full w-full bg-gradient-to-br from-primary/15 via-transparent to-accent/10" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-semibold text-base-content/70">
                <Sparkles size={14} className="text-primary" />
                Premium learning platform
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
                Create your Skillwave account
              </h1>

              <p className="mt-3 text-base-content/70 max-w-xl">
                Choose your path: learn as a <b>Student</b> or teach as a{" "}
                <b>Mentor</b>.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: <ShieldCheck size={18} />,
                    title: "Secure Auth",
                    desc: "JWT + OAuth supported",
                  },
                  {
                    icon: <Lock size={18} />,
                    title: "Safe Passwords",
                    desc: "BCrypt hashing (backend)",
                  },
                  {
                    icon: <Mail size={18} />,
                    title: "Email login",
                    desc: "Simple signup flow",
                  },
                  {
                    icon: <Sparkles size={18} />,
                    title: "Role based",
                    desc: "Student / Mentor experience",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-base-300 bg-base-100/70 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-base-200">
                        {f.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{f.title}</div>
                        <div className="text-sm text-base-content/70">
                          {f.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => nav("/login")}
                >
                  Already have an account? Login
                </Button>
                <Button variant="ghost" size="md" onClick={openGoogle}>
                  Continue with Google
                </Button>
              </div>

              <div className="mt-6 text-xs text-base-content/60">
                By continuing, you agree to our Terms and Privacy Policy (add
                later).
              </div>
            </div>
          </motion.div>

          {/* Right - signup card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 18,
              delay: 0.05,
            }}
            className="rounded-3xl border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="border-b border-base-300 p-6">
              <div className="text-xs font-semibold text-base-content/60">
                Create account
              </div>
              <div className="mt-1 text-2xl font-extrabold tracking-tight">
                Sign up
              </div>
              <div className="mt-2 text-sm text-base-content/70">
                Pick a role, then continue with email/password.
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={onSubmit} className="space-y-3">
                {/* ✅ Role Picker */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-base-content/80">
                    Choose profile
                  </div>
                  <RolePicker
                    value={form.role}
                    onChange={(role) => setForm((s) => ({ ...s, role }))}
                    disabled={loading}
                  />
                </div>

                <PremiumInput
                  label="Full name"
                  icon={<User2 size={18} />}
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  placeholder="Your name"
                  autoComplete="name"
                  error={errors.name}
                />

                <PremiumInput
                  label="Email"
                  icon={<Mail size={18} />}
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      email: e.target.value.replace(/\s/g, ""),
                    }))
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  error={errors.email}
                />

                <PremiumInput
                  label="Password"
                  icon={<Lock size={18} />}
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, password: e.target.value }))
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
                  error={errors.password}
                  hint={
                    form.password
                      ? `Strength: ${strengthText}`
                      : "Minimum 6 characters"
                  }
                />

                {/* strength bar */}
                <div className="mt-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-base-200">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${(Math.max(1, strength) / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-3">
                  <Button
                    variant="gradient"
                    size="lg"
                    fullWidth
                    loading={loading}
                    rightIcon={<ArrowRight size={18} />}
                    disabled={!canSubmit || loading}
                    type="submit"
                  >
                    Create account
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="h-px w-full bg-base-300" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 px-3 text-xs text-base-content/60">
                    OR
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={openGoogle}
                  disabled={loading}
                  type="button"
                >
                  Continue with Google
                </Button>

                <div className="text-sm text-base-content/70">
                  Already have an account?{" "}
                  <Link to="/login" className="link link-hover">
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}