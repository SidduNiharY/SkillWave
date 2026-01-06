import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";

export default function MentorDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Mentor Dashboard"
        subtitle="Create courses, publish content, and start earning."
      />

      <div className="rounded-3xl bg-base-100 p-6 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">Your content</div>
            <div className="text-base-content/70">Manage your courses and publish them.</div>
          </div>

          <div className="flex gap-2">
            <Link to="/mentor/courses">
              <Button variant="outline">My Courses</Button>
            </Link>
            <Link to="/mentor/courses/new">
              <Button variant="gradient">+ Create Course</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}