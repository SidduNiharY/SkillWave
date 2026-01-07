import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageHeader from "../../components/common/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { toast } from "sonner";
import { listMentorSessions, updateSessionStatus } from "../../api/oneonone.js";

export default function MentorSessionsPage() {
  const qc = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["mentor-sessions"],
    queryFn: listMentorSessions,
  });

  const mu = useMutation({
    mutationFn: ({ id, status }) => updateSessionStatus(id, status),
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["mentor-sessions"] });
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader title="1:1 Requests" subtitle="Accept or reject student bookings." />

      {isLoading && <div className="rounded-3xl bg-base-100 p-10 shadow">Loading…</div>}
      {isError && (
        <div className="rounded-3xl bg-base-100 p-10 shadow">
          Failed to load. <button className="link" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <div className="rounded-3xl bg-base-100 p-10 shadow">No requests yet.</div>
      )}

      {!isLoading && !isError && data?.length > 0 && (
        <div className="grid gap-4">
          {data.map((s) => (
            <div key={s.id} className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">Request #{s.id}</div>
                <Badge variant={s.status === "ACCEPTED" ? "success" : s.status === "PENDING" ? "warning" : "error"}>
                  {s.status}
                </Badge>
              </div>

              <div className="mt-2 text-sm text-base-content/70">
                Student: {s.studentId} • {s.sessionDate} • {s.slotTime} • {s.durationMinutes} min
              </div>
              {s.notes ? <div className="mt-2 text-sm">{s.notes}</div> : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="gradient"
                  disabled={mu.isPending || s.status !== "PENDING"}
                  onClick={() => mu.mutate({ id: s.id, status: "ACCEPTED" })}
                >
                  Accept
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={mu.isPending || s.status !== "PENDING"}
                  onClick={() => mu.mutate({ id: s.id, status: "REJECTED" })}
                >
                  Reject
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  disabled={mu.isPending || (s.status !== "ACCEPTED" && s.status !== "PENDING")}
                  onClick={() => mu.mutate({ id: s.id, status: "CANCELLED" })}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}