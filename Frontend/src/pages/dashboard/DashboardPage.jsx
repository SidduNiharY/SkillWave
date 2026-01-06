import React from "react";
import { motion } from "framer-motion";
import PageHeader from "../../components/common/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader
        title="Your Learning"
        subtitle="Continue where you left off and track your progress."
      />

      <div className="rounded-3xl bg-base-100 p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Resume learning</div>
            <div className="mt-1 text-base-content/70">No active course yet. Explore and enroll.</div>
          </div>
          <Link to="/explore">
            <Button variant="gradient">Explore Courses</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl bg-base-100 p-6 shadow">
        <div className="text-lg font-semibold">My Courses (Enrolled)</div>
        <div className="mt-2 text-base-content/70">Coming next: enrollment + progress tracking.</div>
      </div>
    </motion.div>
  );
}