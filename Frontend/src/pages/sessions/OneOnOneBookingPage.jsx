import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageHeader from "../../components/common/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import { toast } from "sonner";
import { bookOneOnOne } from "../../api/oneonone.js";

const SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "18:00"];

export default function OneOnOneBookingPage() {
  const qc = useQueryClient();

  const [form, setForm] = useState({
    mentorId: "",
    durationMinutes: 30,
    sessionDate: "",
    slotTime: "10:00",
    notes: "",
  });

  const canBook = useMemo(() => {
    return (
      String(form.mentorId).trim().length > 0 &&
      form.sessionDate &&
      form.slotTime &&
      Number(form.durationMinutes) > 0
    );
  }, [form]);

  const m = useMutation({
    mutationFn: () =>
      bookOneOnOne({
        mentorId: Number(form.mentorId),
        durationMinutes: Number(form.durationMinutes),
        sessionDate: form.sessionDate, // YYYY-MM-DD
        slotTime: form.slotTime,
        notes: form.notes,
      }),
    onSuccess: () => {
      toast.success("Booking request sent (PENDING)!");
      qc.invalidateQueries({ queryKey: ["my-sessions"] });
      setForm((s) => ({ ...s, notes: "" }));
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader
        title="Book a 1:1 Session"
        subtitle="MVP flow: pick a mentorId + date + slot → send request → mentor accepts."
      />

      <div className="rounded-3xl bg-base-100 p-6 shadow space-y-4 max-w-2xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Mentor ID</label>
            <input
              className="input input-bordered w-full rounded-2xl"
              placeholder="ex: 3"
              value={form.mentorId}
              onChange={(e) => setForm((s) => ({ ...s, mentorId: e.target.value }))}
            />
            <div className="text-xs text-base-content/60">
              (For now we type mentorId. Next step: show real mentor cards + profiles.)
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Duration (minutes)</label>
            <input
              type="number"
              className="input input-bordered w-full rounded-2xl"
              value={form.durationMinutes}
              onChange={(e) => setForm((s) => ({ ...s, durationMinutes: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Date</label>
            <input
              type="date"
              className="input input-bordered w-full rounded-2xl"
              value={form.sessionDate}
              onChange={(e) => setForm((s) => ({ ...s, sessionDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Slot</label>
            <select
              className="select select-bordered w-full rounded-2xl"
              value={form.slotTime}
              onChange={(e) => setForm((s) => ({ ...s, slotTime: e.target.value }))}
            >
              {SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Notes</label>
          <textarea
            className="textarea textarea-bordered w-full rounded-2xl"
            rows={4}
            value={form.notes}
            onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
            placeholder="Tell mentor what you want to discuss…"
          />
        </div>

        <Button
          variant="gradient"
          disabled={!canBook || m.isPending}
          loading={m.isPending}
          onClick={() => m.mutate()}
        >
          Request Booking
        </Button>
      </div>
    </motion.div>
  );
}