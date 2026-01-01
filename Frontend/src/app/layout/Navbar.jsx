import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  LogOut,
  Palette,
  User2,
} from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../app/providers/AuthProvider.jsx";

const THEMES = [
  "light",
  "dark",
  "corporate",
  "business",
  "emerald",
  "cupcake",
  "dracula",
  "night",
];

const navLinkClass = ({ isActive }) =>
  [
    "px-3 py-2 rounded-xl text-sm font-medium transition",
    isActive
      ? "bg-base-200 text-base-content"
      : "text-base-content/70 hover:text-base-content hover:bg-base-200/70",
  ].join(" ");

export default function Navbar() {
  const { isAuthed, user, logout } = useAuth(); // ✅ from provider
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState("light");
  const searchRef = useRef(null);

  // ✅ close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // ✅ theme init
  useEffect(() => {
    const saved = localStorage.getItem("skillwave_theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const applyTheme = (t) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("skillwave_theme", t);
  };

  const onSearch = (e) => {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/explore?q=${encodeURIComponent(query)}` : "/explore");
  };

  // ✅ Cmd/Ctrl+K focus search
  useEffect(() => {
    const handler = (e) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const displayUser = useMemo(() => {
    // ✅ safe even if provider doesn't supply user yet
    if (!user) return null;
    return user.name || user.displayName || user.email || null;
  }, [user]);

  return (
    <>
      <header className="sticky top-0 z-40">
        <div className="h-[1px] w-full bg-gradient-to-r from-primary/50 via-secondary/20 to-accent/40" />

        <div className="border-b border-base-300 bg-base-100/80 backdrop-blur-xl">
          <div className="container-max flex h-16 items-center gap-3">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-content shadow-sm">
                <GraduationCap size={20} />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2 font-bold tracking-tight">
                  Skillwave
                  <span className="badge badge-primary badge-outline hidden sm:inline-flex">
                    Beta
                  </span>
                </div>
                <div className="text-[11px] text-base-content/60">
                  Recorded • Live • 1:1
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="ml-6 hidden items-center gap-1 lg:flex">
              <NavLink to="/explore" className={navLinkClass}>
                Explore
              </NavLink>
              <NavLink to="/live" className={navLinkClass}>
                Live
              </NavLink>
              <NavLink to="/mentorship" className={navLinkClass}>
                1:1
              </NavLink>
              <NavLink to="/pricing" className={navLinkClass}>
                Pricing
              </NavLink>
            </nav>

            {/* Search (desktop) */}
            <div className="hidden flex-1 lg:flex">
              <form
                onSubmit={onSearch}
                className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-2xl border border-base-300 bg-base-100 px-3 py-2 shadow-sm"
              >
                <Search size={16} className="text-base-content/50" />
                <input
                  ref={searchRef}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-base-content/45"
                  placeholder="Search courses, live sessions, mentors…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <kbd className="kbd kbd-sm hidden xl:inline-flex">⌘K</kbd>
              </form>
            </div>

            {/* Right controls */}
            <div className="ml-auto flex items-center gap-2">
              {/* Theme dropdown */}
              <div className="dropdown dropdown-end">
                <Button variant="ghost" size="sm" className="rounded-xl" aria-label="Theme">
                  <Palette size={18} />
                  <ChevronDown size={14} className="opacity-60" />
                </Button>

                <div className="dropdown-content mt-2 w-56 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl">
                  <div className="px-2 py-2 text-xs font-semibold text-base-content/60">
                    Theme
                  </div>

                  <div className="max-h-64 overflow-auto">
                    {THEMES.map((t) => (
                      <button
                        key={t}
                        onClick={() => applyTheme(t)}
                        className={[
                          "w-full rounded-xl px-3 py-2 text-left text-sm transition",
                          theme === t ? "bg-primary text-primary-content" : "hover:bg-base-200",
                        ].join(" ")}
                      >
                        {t[0].toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auth */}
              {isAuthed ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-base-300 bg-base-100 px-3 py-2">
                    <User2 size={16} className="opacity-70" />
                    <span className="text-sm text-base-content/70">
                      {displayUser || "Account"}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl hidden sm:inline-flex"
                    leftIcon={<LayoutDashboard size={16} />}
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl"
                    leftIcon={<LogOut size={16} />}
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl hidden sm:inline-flex"
                    leftIcon={<Sparkles size={16} />}
                    onClick={() => navigate("/pricing")}
                  >
                    Pro
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl hidden sm:inline-flex"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </Button>

                  <Button
                    variant="gradient"
                    size="sm"
                    className="rounded-2xl"
                    rightIcon={<span>→</span>}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </>
              )}

              {/* Mobile toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl lg:hidden"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-base-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-300 p-4">
              <div className="font-semibold">Menu</div>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>

            <div className="p-4 space-y-3">
              <form
                onSubmit={onSearch}
                className="flex items-center gap-2 rounded-2xl border border-base-300 bg-base-100 px-3 py-2 shadow-sm"
              >
                <Search size={16} className="text-base-content/50" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-base-content/45"
                  placeholder="Search…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </form>

              <div className="space-y-1">
                {[
                  ["Explore", "/explore"],
                  ["Live Sessions", "/live"],
                  ["1:1 Mentorship", "/mentorship"],
                  ["Pricing", "/pricing"],
                ].map(([label, path]) => (
                  <Link
                    key={path}
                    to={path}
                    className="btn btn-ghost w-full justify-start rounded-xl"
                    onClick={() => setMobileOpen(false)} // ✅ close drawer
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="divider" />

              {isAuthed ? (
                <>
                  <div className="rounded-2xl border border-base-300 bg-base-100 px-3 py-3">
                    <div className="text-xs text-base-content/60">Signed in as</div>
                    <div className="text-sm font-semibold">{displayUser || "Account"}</div>
                  </div>

                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    className="rounded-xl justify-start"
                    leftIcon={<LayoutDashboard size={16} />}
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    Dashboard
                  </Button>

                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    className="rounded-xl justify-start"
                    leftIcon={<LogOut size={16} />}
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                      navigate("/");
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    className="rounded-xl"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/signup");
                    }}
                  >
                    Sign up
                  </Button>

                  <Button
                    variant="gradient"
                    size="md"
                    fullWidth
                    className="rounded-2xl"
                    rightIcon={<span>→</span>}
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/login");
                    }}
                  >
                    Login
                  </Button>
                </div>
              )}

              <div className="divider" />

              <div className="text-xs font-semibold text-base-content/60">Theme</div>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.slice(0, 6).map((t) => (
                  <button
                    key={t}
                    className={[
                      "btn btn-sm rounded-xl",
                      theme === t ? "btn-primary" : "btn-outline",
                    ].join(" ")}
                    onClick={() => applyTheme(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}