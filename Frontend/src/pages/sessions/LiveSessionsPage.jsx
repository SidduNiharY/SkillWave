import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Video } from "lucide-react";
import Button from "../../components/ui/Button.jsx";

const sessions = [
  { title: "Spring Boot + OAuth Deep Dive", date: "Fri • 7:30 PM", level: "Intermediate", seats: "18/30" },
  { title: "Kafka Outbox Pattern (Real Implementation)", date: "Sat • 11:00 AM", level: "Advanced", seats: "22/40" },
  { title: "React Query + Auth Architecture", date: "Sun • 5:00 PM", level: "Beginner", seats: "12/25" },
];

export default function LiveSessionsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="soft-card p-8 md:p-10">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-base-200">
            <CalendarDays size={18} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Live Sessions</h1>
            <p className="text-base-content/70">Join cohort sessions, ask questions, and access recordings later.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((s) => (
          <div key={s.title} className="soft-card p-6">
            <div className="flex items-center justify-between">
              <span className="badge badge-outline">{s.level}</span>
              <span className="text-sm text-base-content/70">{s.seats} seats</span>
            </div>
            <div className="mt-3 text-lg font-semibold">{s.title}</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-base-content/70">
              <Video size={16} /> {s.date}
            </div>
            <div className="mt-5 flex gap-2">
              <Button className="flex-1">Reserve</Button>
              <Button variant="outline" className="flex-1">Details</Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}