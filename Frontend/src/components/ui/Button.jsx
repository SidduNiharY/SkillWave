import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Ultra Premium 3D Button (Skillwave) — Upgraded ✅
 *
 * Keeps EVERYTHING you already have, and upgrades:
 * ✅ accessibility (aria-busy, aria-disabled, keyboard focus)
 * ✅ form behavior (type still supported)
 * ✅ click works even when 3D transform is animated (no pointer trap)
 * ✅ better disabled handling (no pointer-events:none so forms still behave)
 * ✅ optional haptics on mobile
 * ✅ optional "press glow" feedback
 *
 * Props:
 * - variant: primary | outline | ghost | neutral | gradient | danger | glass
 * - size: sm | md | lg | xl
 * - type: button | submit | reset
 * - loading: boolean
 * - leftIcon / rightIcon: ReactNode
 * - fullWidth: boolean
 * - magnetic: boolean (default true)
 * - ripple: boolean (default true)
 * - sparkles: boolean (default true)
 * - depth: number (default 14)
 * - haptics: boolean (default true)
 * - pressGlow: boolean (default true)
 */
export default function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  magnetic = true,
  ripple = true,
  sparkles = true,
  depth = 14,
  haptics = true,
  pressGlow = true,
  children,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...props
}) {
  const ref = useRef(null);

  const isDisabled = !!disabled || !!loading;

  // Motion values for magnetic translation (px)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Springs for smoothness
  const smx = useSpring(mx, { stiffness: 320, damping: 26, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 320, damping: 26, mass: 0.5 });

  // Tilt (deg) and spotlight
  const [hover, setHover] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 50, rx: 0, ry: 0 });

  // Ripple state
  const [ripples, setRipples] = useState([]);

  // Sparkles state
  const [sparks, setSparks] = useState([]);

  // Press glow
  const [pressed, setPressed] = useState(false);

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-6 text-base",
    xl: "h-14 px-7 text-base",
  };

  const variants = {
    primary:
      "text-primary-content bg-primary border-none " +
      "shadow-[0_18px_50px_-28px_rgba(0,0,0,0.80)]",
    outline:
      "bg-base-100 text-base-content border border-base-300 " +
      "shadow-[0_14px_40px_-30px_rgba(0,0,0,0.70)]",
    ghost:
      "bg-transparent text-base-content hover:bg-base-200/40 border border-transparent",
    neutral:
      "text-neutral-content bg-neutral border-none " +
      "shadow-[0_18px_50px_-28px_rgba(0,0,0,0.80)]",
    danger:
      "text-error-content bg-error border-none " +
      "shadow-[0_18px_50px_-28px_rgba(0,0,0,0.80)]",
    glass:
      "bg-base-100/55 backdrop-blur border border-base-300/60 text-base-content " +
      "shadow-[0_14px_40px_-30px_rgba(0,0,0,0.70)]",
    gradient:
      "text-primary-content border-none " +
      "bg-gradient-to-r from-primary via-secondary to-accent " +
      "shadow-[0_22px_60px_-35px_rgba(0,0,0,0.85)]",
  };

  const base =
    "group relative inline-flex select-none items-center justify-center gap-2 " +
    "rounded-2xl font-semibold leading-none " +
    "transition-[filter,opacity] duration-200 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 " +
    "will-change-transform";

  const width = fullWidth ? "w-full" : "";

  // Clean up ripple nodes
  useEffect(() => {
    if (!ripples.length) return;
    const t = setTimeout(() => setRipples((r) => r.slice(1)), 520);
    return () => clearTimeout(t);
  }, [ripples]);

  // Clean up sparkles nodes
  useEffect(() => {
    if (!sparks.length) return;
    const t = setTimeout(
      () => setSparks((s) => s.filter((x) => Date.now() - x.t < 650)),
      260
    );
    return () => clearTimeout(t);
  }, [sparks]);

  const makeSparkBurst = (clientX, clientY) => {
    if (!sparkles || isDisabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();

    const localX = clientX - r.left;
    const localY = clientY - r.top;

    const now = Date.now();
    const next = Array.from({ length: 10 }).map((_, i) => {
      const ang = (Math.PI * 2 * i) / 10 + Math.random() * 0.35;
      const dist = 18 + Math.random() * 18;
      return {
        id: `${now}-${i}`,
        t: now,
        x: localX,
        y: localY,
        dx: Math.cos(ang) * dist,
        dy: Math.sin(ang) * dist,
        s: 2 + Math.random() * 2.8,
      };
    });

    setSparks((prev) => [...prev.slice(-20), ...next]);
  };

  const handleMove = (e) => {
    if (isDisabled) return;

    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    const x = px * 100;
    const y = py * 100;

    const ry = (px - 0.5) * depth * 2;
    const rx = (0.5 - py) * depth * 2;

    setSpot({ x, y, rx, ry });

    if (magnetic) {
      const m = 10;
      mx.set((px - 0.5) * m);
      my.set((py - 0.5) * m);
    }

    onMouseMove?.(e);
  };

  const handleEnter = (e) => {
    if (!isDisabled) setHover(true);
    makeSparkBurst(e.clientX, e.clientY);
    onMouseEnter?.(e);
  };

  const handleLeave = (e) => {
    setHover(false);
    setSpot({ rx: 0, ry: 0, x: 50, y: 50 });
    mx.set(0);
    my.set(0);
    onMouseLeave?.(e);
  };

  const vibrate = (ms = 10) => {
    try {
      if (!haptics) return;
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
    } catch {
      // ignore
    }
  };

  const handleClick = (e) => {
    if (isDisabled) return;

    // ripple
    if (ripple) {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        setRipples((prev) => [...prev.slice(-2), { id: Date.now(), x, y }]);
      }
    }

    // spark burst
    makeSparkBurst(e.clientX, e.clientY);

    // haptics
    vibrate(8);

    onClick?.(e);
  };

  const styleVars = useMemo(
    () => ({
      "--sx": `${spot.x}%`,
      "--sy": `${spot.y}%`,
    }),
    [spot.x, spot.y]
  );

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading || undefined}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onPointerDown={() => {
        if (isDisabled) return;
        setPressed(true);
      }}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onClick={handleClick}
      className={clsx(
        base,
        sizes[size],
        variants[variant],
        width,
        isDisabled && "opacity-70 cursor-not-allowed saturate-50",
        className
      )}
      style={{
        ...styleVars,
        transformStyle: "preserve-3d",
        // IMPORTANT: don't block click; allow transforms but keep it clickable
        transform: hover
          ? `perspective(950px) translate3d(${smx.get()}px, ${smy.get()}px, 0) rotateX(${spot.rx}deg) rotateY(${spot.ry}deg)`
          : `perspective(950px) translate3d(0,0,0) rotateX(0deg) rotateY(0deg)`,
      }}
      whileTap={!isDisabled ? { scale: 0.965 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      {...props}
    >
      {/* ==== Deep layer (gives depth) ==== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          transform: "translateZ(-14px)",
          background:
            "radial-gradient(240px 160px at 50% 120%, rgba(0,0,0,0.22), rgba(0,0,0,0) 65%)",
          opacity: hover ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />

      {/* ==== Outer Glow Ring follows cursor ==== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[2px] rounded-[18px] blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            variant === "gradient"
              ? "radial-gradient(140px 90px at var(--sx) var(--sy), rgba(255,255,255,0.32), rgba(255,255,255,0.06) 45%, rgba(0,0,0,0) 72%)"
              : "radial-gradient(140px 90px at var(--sx) var(--sy), rgba(99,102,241,0.44), rgba(99,102,241,0.10) 45%, rgba(0,0,0,0) 72%)",
        }}
      />

      {/* ==== Press glow (new) ==== */}
      {pressGlow && !isDisabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
          style={{
            transform: "translateZ(9px)",
            opacity: pressed ? 0.65 : 0,
            background:
              variant === "gradient"
                ? "radial-gradient(220px 140px at var(--sx) var(--sy), rgba(255,255,255,0.22), rgba(255,255,255,0.06) 45%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(220px 140px at var(--sx) var(--sy), rgba(99,102,241,0.26), rgba(99,102,241,0.08) 45%, rgba(0,0,0,0) 70%)",
          }}
        />
      )}

      {/* ==== Specular highlight (gloss) ==== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          transform: "translateZ(10px)",
          background:
            "radial-gradient(260px 140px at var(--sx) var(--sy), rgba(255,255,255,0.26), rgba(255,255,255,0.10) 35%, rgba(0,0,0,0) 70%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* ==== Sheen sweep ==== */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <span
          className={clsx(
            "absolute -left-[70%] top-0 h-full w-[70%] rotate-12",
            "bg-gradient-to-r from-transparent via-white/28 to-transparent",
            "blur-[0.6px] transition-all duration-700 ease-out",
            "group-hover:left-[125%]"
          )}
          style={{ transform: "translateZ(12px) rotate(12deg)" }}
        />
      </span>

      {/* ==== Ripples ==== */}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: 12,
            height: 12,
            transform: "translate(-50%,-50%) translateZ(14px)",
            background: "rgba(255,255,255,0.35)",
            animation: "swRipple 520ms ease-out forwards",
          }}
        />
      ))}

      {/* ==== Sparkles ==== */}
      {sparks.map((s) => (
        <span
          key={s.id}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
          style={{
            left: s.x,
            top: s.y,
            width: s.s,
            height: s.s,
            transform: `translate(-50%,-50%) translateZ(16px) translate(${s.dx}px, ${s.dy}px)`,
            background:
              variant === "gradient"
                ? "rgba(255,255,255,0.85)"
                : "rgba(99,102,241,0.85)",
            filter: "blur(0.2px)",
            animation: "swSpark 650ms ease-out forwards",
          }}
        />
      ))}

      {/* ==== Border micro highlight ==== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/12"
        style={{ transform: "translateZ(8px)" }}
      />

      {/* ==== Content (top layer) ==== */}
      <span
        className="relative z-10 inline-flex items-center gap-2"
        style={{ transform: "translateZ(18px)" }}
      >
        {loading ? <span className="loading loading-spinner loading-sm" /> : leftIcon}

        <span className="tracking-tight">{children}</span>

        {!loading && rightIcon && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            {rightIcon}
          </span>
        )}
      </span>

      {/* extra: subtle breathing glow for gradient CTA */}
      {variant === "gradient" && !isDisabled && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ transform: "translateZ(6px)" }}
          animate={{ opacity: [0.10, 0.22, 0.10] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* local keyframes */}
      <style>{`
        @keyframes swRipple {
          0% { opacity: 0.55; transform: translate(-50%,-50%) translateZ(14px) scale(1); }
          100% { opacity: 0; transform: translate(-50%,-50%) translateZ(14px) scale(10); }
        }
        @keyframes swSpark {
          0% { opacity: 0.85; }
          100% { opacity: 0; }
        }
      `}</style>
    </motion.button>
  );
}