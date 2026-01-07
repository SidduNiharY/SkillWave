import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageHeader from "../../components/common/PageHeader.jsx";
import { listMySessions } from "../../api/oneonone.js";
import Badge from "../../components/ui/Badge.jsx";

export default function MySessionsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-sessions"],
    queryFn: listMySessions,
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader title="My 1:1 Sessions" subtitle="Your booking requests and mentor responses." />

      {isLoading && <div className="rounded-3xl bg-base-100 p-10 shadow">Loading…</div>}
      {isError && (
        <div className="rounded-3xl bg-base-100 p-10 shadow">
          Failed to load. <button className="link" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <div className="rounded-3xl bg-base-100 p-10 shadow">No sessions yet.</div>
      )}

      {!isLoading && !isError && data?.length > 0 && (
        <div className="grid gap-4">
          {data.map((s) => (
            <div key={s.id} className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">Session #{s.id}</div>
                <Badge variant={s.status === "ACCEPTED" ? "success" : s.status === "PENDING" ? "warning" : "error"}>
                  {s.status}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-base-content/70">
                Mentor: {s.mentorId} • {s.sessionDate} • {s.slotTime} • {s.durationMinutes} min
              </div>
              {s.notes ? <div className="mt-2 text-sm">{s.notes}</div> : null}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}