import React from "react";
import {
  Github,
  Linkedin,
  Mail,
  Globe,
  Twitter,
  Youtube,
  ArrowUpRight,
} from "lucide-react";

const PROFILE = {
  name: "Siddumanju",
  role: "Full-Stack Developer",
  tagline: "Building premium learning experiences (Live • Recorded • 1:1).",
  website: "https://your-portfolio.com",
  email: "your.email@gmail.com",
  github: "https://github.com/your-username",
  linkedin: "https://www.linkedin.com/in/your-username",
  twitter: "https://twitter.com/your-username", // optional
  youtube: "https://youtube.com/@your-username", // optional
};

const SOCIAL = [
  { label: "Website", href: PROFILE.website, Icon: Globe },
  { label: "LinkedIn", href: PROFILE.linkedin, Icon: Linkedin },
  { label: "GitHub", href: PROFILE.github, Icon: Github },
  { label: "Email", href: `mailto:${PROFILE.email}`, Icon: Mail },
  { label: "Twitter", href: PROFILE.twitter, Icon: Twitter, optional: true },
  { label: "YouTube", href: PROFILE.youtube, Icon: Youtube, optional: true },
].filter((x) => x.href && (!x.optional || x.href));

function FooterLink({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 text-sm text-base-content/70 hover:text-base-content transition"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
      <ArrowUpRight size={14} className="opacity-50" />
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 border-t border-base-300 bg-base-100">
      {/* subtle premium gradient */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="h-full w-full bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      </div>

      <div className="container-max relative py-12">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand / about */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-primary text-primary-content grid place-items-center shadow-sm">
                <span className="text-lg font-black">S</span>
              </div>
              <div className="leading-tight">
                <div className="text-base font-extrabold tracking-tight">
                  Skillwave
                </div>
                <div className="text-xs text-base-content/60">
                  {PROFILE.role} • {PROFILE.name}
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-base-content/70">
              {PROFILE.tagline}
            </p>

            {/* Newsletter / contact card */}
            <div className="mt-6 rounded-3xl border border-base-300 bg-base-100/70 backdrop-blur p-4 shadow-sm">
              <div className="text-sm font-semibold">Let’s connect</div>
              <div className="mt-1 text-xs text-base-content/60">
                Want to collaborate? Drop a message.
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="btn btn-primary btn-sm rounded-2xl w-full sm:w-auto"
                >
                  <Mail size={16} />
                  Email me
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm rounded-2xl w-full sm:w-auto"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Platform
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <FooterLink href="/explore">Explore</FooterLink>
              <FooterLink href="/live">Live Sessions</FooterLink>
              <FooterLink href="/mentorship">1:1 Mentorship</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
            </div>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Resources
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/support">Support</FooterLink>
              <FooterLink href="/docs">Docs</FooterLink>
              <FooterLink href="/status">Status</FooterLink>
            </div>
          </div>

          {/* Social */}
          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Social
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-center gap-2 rounded-2xl border border-base-300 bg-base-100/70 px-3 py-2 text-sm text-base-content/75 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
                >
                  <Icon size={16} className="opacity-80" />
                  <span className="truncate">{label}</span>
                  <ArrowUpRight
                    size={14}
                    className="ml-auto opacity-0 transition group-hover:opacity-60"
                  />
                </a>
              ))}
            </div>

            {/* Tech stack pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["React", "Tailwind", "daisyUI", "Framer Motion", "Spring Boot", "PostgreSQL"].map(
                (t) => (
                  <span
                    key={t}
                    className="badge badge-outline border-base-300 text-base-content/70"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-base-300 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-base-content/60">
            © {year} <span className="font-semibold text-base-content/80">Skillwave</span>. Built by{" "}
            <span className="font-semibold text-base-content/80">{PROFILE.name}</span>.
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <a className="link-hover text-base-content/60 hover:text-base-content" href="/privacy">
              Privacy
            </a>
            <a className="link-hover text-base-content/60 hover:text-base-content" href="/terms">
              Terms
            </a>
            <a
              className="link-hover text-base-content/60 hover:text-base-content"
              href={`mailto:${PROFILE.email}`}
            >
              {PROFILE.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}