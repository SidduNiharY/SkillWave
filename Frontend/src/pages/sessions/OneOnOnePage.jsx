import React from "react";
import { motion } from "framer-motion";
import { Users, Star } from "lucide-react";
import Button from "../../components/ui/Button.jsx";

const mentors = [
  { name: "Aarav", role: "Backend • Spring Boot", rating: 4.9, tag: "Payments + Kafka" },
  { name: "Meera", role: "Frontend • React", rating: 4.8, tag: "UI Architecture" },
  { name: "Kabir", role: "Fullstack", rating: 4.9, tag: "System Design" },
  { name: "Isha", role: "DevOps", rating: 4.7, tag: "Docker + Deploy" },
];

export default function OneOnOnePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="soft-card p-8 md:p-10">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-base-200">
            <Users size={18} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">1:1 Mentorship</h1>
            <p className="text-base-content/70">Book mentors, track goals, and accelerate learning.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mentors.map((m) => (
          <div key={m.name} className="soft-card p-6">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{m.name}</div>
              <div className="flex items-center gap-1 text-sm">
                <Star size={14} /> {m.rating}
              </div>
            </div>
            <div className="mt-2 text-sm text-base-content/70">{m.role}</div>
            <div className="mt-3">
              <span className="badge badge-ghost">{m.tag}</span>
            </div>
            <div className="mt-5">
              <Button className="w-full">Book a Session</Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}