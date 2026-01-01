import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/courses.js";
import { motion } from "framer-motion";
import PageHeader from "../../components/common/PageHeader.jsx";
import DashboardSkeleton from "./DashboardSkeleton.jsx";
import { Card, CardBody, CardTitle } from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { toast } from "sonner";
import { useAuth } from "../../app/providers/AuthProvider.jsx";

export default function DashboardPage() {
  const { logout } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  useEffect(() => {
    if (isError) toast.error("Failed to load /api/me. Check JWT + backend.");
  }, [isError]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="rounded-3xl bg-base-100 p-10 text-center shadow">
        <h2 className="text-xl font-semibold">Dashboard unavailable</h2>
        <p className="mt-2 text-base-content/70">
          Your token might be invalid. Try re-login.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={() => refetch()}>Retry</Button>
          <Button variant="outline" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="This page proves your Google OAuth → JWT → secured API is working."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl">
          <CardBody>
            <div className="text-sm text-base-content/70">User ID</div>
            <div className="mt-2 text-2xl font-bold">{data.userId}</div>
          </CardBody>
        </Card>

        <Card className="rounded-3xl">
          <CardBody>
            <div className="text-sm text-base-content/70">Email</div>
            <div className="mt-2 truncate text-lg font-semibold">{data.email}</div>
          </CardBody>
        </Card>

        <Card className="rounded-3xl">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-base-content/70">Role</div>
                <div className="mt-2 text-2xl font-bold">{data.role}</div>
              </div>
              <Badge variant="info">JWT</Badge>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="rounded-3xl bg-base-100 p-6 shadow">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Next build steps</h3>
          <Button variant="outline" onClick={() => toast.message("Next: create enrollments + purchased courses list")}>
            Plan
          </Button>
        </div>
        <ul className="mt-3 space-y-2 text-base-content/70">
          <li>• Create “Enrollments” table in backend</li>
          <li>• Connect “Buy now” → /api/purchases</li>
          <li>• Add “My Courses” section here</li>
          <li>• Add Live Sessions + One-on-One booking UI</li>
        </ul>
      </div>
    </motion.div>
  );
}