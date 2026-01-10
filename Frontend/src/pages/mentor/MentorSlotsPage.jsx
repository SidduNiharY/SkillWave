import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../components/common/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { toast } from "sonner";
import { mentorCreateSlot, mentorMySlots } from "../../api/mentorship.js";

function toISO(localDateTime) {
  // input like "2026-01-09T10:00"
  // Convert to ISO string using browser timezone -> backend uses Instant (UTC)
  const d = new Date(localDateTime);
  return d.toISOString();
}

function fmt(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function MentorSlotsPage() {
  const qc = useQueryClient();

  const [form, setForm] = useState({
    startLocal: "",
    endLocal: "",
    price: 499,
    currency: "INR",
  });

  const errors = useMemo(() => {
    const e = {};
    if (!form.startLocal) e.startLocal = "Start time required";
    if (!form.endLocal) e.endLocal = "End time required";
    if (!form.price || Number(form.price) <= 0) e.price = "Price must be > 0";
    return e;
  }, [form]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["mentor-my-slots"],
    queryFn: mentorMySlots,
  });

  const create = useMutation({
    mutationFn: () =>
      mentorCreateSlot({
        startAt: toISO(form.startLocal),
        endAt: toISO(form.endLocal),
        price: Number(form.price),
        currency: form.currency?.trim() || "INR",
      }),
    onSuccess: () => {
      toast.success("Slot created!");
      qc.invalidateQueries({ queryKey: ["mentor-my-slots"] });
      setForm((s) => ({ ...s, startLocal: "", endLocal: "" }));
    },
    onError: (e) => {
      toast.error(e?.response?.data?.message || e?.message || "Failed");
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mentor Slots"
        subtitle="Create availability slots for 1:1 mentorship."
        right={
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        }
      />

      <div className="rounded-3xl bg-base-100 p-6 shadow-sm space-y-4">
        <div className="text-lg font-semibold">Create a slot</div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Start *</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full rounded-2xl"
              value={form.startLocal}
              onChange={(e) => setForm((s) => ({ ...s, startLocal: e.target.value }))}
            />
            {errors.startLocal && <div className="text-error text-sm">{errors.startLocal}</div>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">End *</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full rounded-2xl"
              value={form.endLocal}
              onChange={(e) => setForm((s) => ({ ...s, endLocal: e.target.value }))}
            />
            {errors.endLocal && <div className="text-error text-sm">{errors.endLocal}</div>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Price *</label>
            <input
              type="number"
              className="input input-bordered w-full rounded-2xl"
              value={form.price}
              onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
            />
            {errors.price && <div className="text-error text-sm">{errors.price}</div>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Currency</label>
            <input
              className="input input-bordered w-full rounded-2xl"
              value={form.currency}
              onChange={(e) => setForm((s) => ({ ...s, currency: e.target.value }))}
            />
          </div>
        </div>

        <Button
          variant="gradient"
          loading={create.isPending}
          disabled={create.isPending || Object.keys(errors).length > 0}
          onClick={() => create.mutate()}
        >
          Create Slot
        </Button>
      </div>

      <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
        <div className="text-lg font-semibold">My Slots</div>

        {isLoading ? (
          <div className="mt-4">Loading…</div>
        ) : isError ? (
          <div className="mt-4">Failed to load.</div>
        ) : !data?.length ? (
          <div className="mt-4 text-base-content/70">No slots yet.</div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {data.map((s) => (
              <div key={s.id} className="rounded-3xl border border-base-300 p-5">
                <div className="flex items-center justify-between">
                  <div className="font-bold">Slot #{s.id}</div>
                  <Badge variant={s.status === "AVAILABLE" ? "success" : "warning"}>
                    {s.status}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-base-content/70 space-y-1">
                  <div>Start: {fmt(s.startAt)}</div>
                  <div>End: {fmt(s.endAt)}</div>
                  <div>Price: {s.currency} {s.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}