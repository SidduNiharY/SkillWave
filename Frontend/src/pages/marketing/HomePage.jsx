import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Video, Users, ShieldCheck } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { Card, CardBody } from "../../components/ui/Card.jsx";

const Fade = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
    {children}
  </motion.div>
);

function Stat({ label, value }) {
  return (
    <div className="soft-card p-5">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-base-content/70">{label}</div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <Card className="rounded-3xl">
      <CardBody>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-base-200">{icon}</div>
          <div>
            <div className="font-semibold">{title}</div>
            <div className="mt-1 text-sm text-base-content/70">{desc}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Fade>
        <section className="grad-hero soft-card overflow-hidden p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="badge badge-primary badge-outline">Learn like Udemy — with Live + 1:1</div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
                Build real skills with <span className="text-primary">recorded</span> courses,
                <span className="text-primary"> live</span> cohorts & <span className="text-primary">1:1</span> mentorship.
              </h1>
              <p className="mt-4 text-base-content/70 md:text-lg">
                Skillwave is your product-quality learning platform: authentication, payments, caching, eventing —
                and a UI that feels like a real startup.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/explore" className="sm:w-auto">
                  <Button className="w-full sm:w-auto">
                    Explore Courses <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/live" className="sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">
                    View Live Sessions
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-sm text-base-content/60">
                <span className="badge badge-ghost">Google OAuth</span>
                <span className="badge badge-ghost">PostgreSQL + Flyway</span>
                <span className="badge badge-ghost">Redis caching</span>
                <span className="badge badge-ghost">Kafka events</span>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="soft-card p-6">
                <div className="text-sm text-base-content/70">Today’s spotlight</div>
                <div className="mt-2 text-xl font-bold">Spring Boot Payments + Kafka Outbox</div>
                <div className="mt-2 text-sm text-base-content/70">
                  Learn production patterns with real project structure.
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="btn-sm">Preview</Button>
                  <Button className="btn-sm">Enroll</Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Stat label="Courses" value="120+" />
                <Stat label="Live cohorts" value="28" />
                <Stat label="Mentors" value="45" />
              </div>
            </div>
          </div>
        </section>
      </Fade>

      <Fade>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Why Skillwave feels premium</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Feature icon={<Video size={18} />} title="Recorded mastery" desc="Structured curriculum + progress tracking UI." />
            <Feature icon={<CalendarDays size={18} />} title="Live sessions" desc="Cohorts, schedules, reminders, replays." />
            <Feature icon={<Users size={18} />} title="1:1 mentorship" desc="Book mentors, meet, and track outcomes." />
            <Feature icon={<ShieldCheck size={18} />} title="Secure auth" desc="OAuth login + JWT for protected APIs." />
          </div>
        </section>
      </Fade>

      <Fade>
        <section className="soft-card p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Ready to build your learning streak?</h3>
              <p className="mt-2 text-base-content/70">
                Start with the catalog, then jump into a live cohort or book a 1:1.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/pricing"><Button variant="outline">See Pricing</Button></Link>
              <Link to="/explore"><Button>Get Started</Button></Link>
            </div>
          </div>
        </section>
      </Fade>
    </div>
  );
}