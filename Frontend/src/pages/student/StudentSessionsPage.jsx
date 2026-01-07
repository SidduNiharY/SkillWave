import React from "react";
import { motion } from "framer-motion";
import PageHeader from "../../components/common/PageHeader.jsx";

export default function StudentSessionsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader
        title="My Sessions"
        subtitle="Your booked 1-on-1 sessions will appear here (backend next)."
      />

      <div className="rounded-3xl bg-base-100 p-10 shadow text-base-content/70">
        Coming next: list sessions + join link + cancellation.
      </div>
    </motion.div>
  );
}