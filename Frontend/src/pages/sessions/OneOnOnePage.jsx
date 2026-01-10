import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../components/common/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { toast } from "sonner";
import { mentorAvailableSlots, bookSlot } from "../../api/mentorship.js";

function fmt(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function OneOnOnePage() {
  const qc = useQueryClient();

  // For MVP we input mentorId manually (later: mentor list)
  const [mentorId, setMentorId] = useState("");
  const [note, setNote] = useState("");

  const canSearch = useMemo(() => /^\d+$/.test(mentorId.trim()), [mentorId]);

  const {
    data: slots,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["mentor-available-slots", mentorId],
    queryFn: () => mentorAvailableSlots(mentorId.trim()),
    enabled: false, // we search manually
  });

  const book = useMutation({
    mutationFn: (slotId) =>
      bookSlot({
        slotId,
        note: note?.trim() || null,
      }),
    onSuccess: () => {
      toast.success("Booked successfully!");
      qc.invalidateQueries({ queryKey: ["mentor-available-slots", mentorId] });
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      refetch();
    },
    onError: (e) => {
      toast.error(e?.response?.data?.message || e?.message || "Booking failed");
    },
  });

  const onSearch = async () => {
    if (!canSearch) return toast.error("Enter a valid Mentor ID (number)");
    await refetch();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="1:1 Mentorship"
        subtitle="Pick a mentor slot and book instantly."
      />

      {/* Search mentor */}
      <div className="rounded-3xl bg-base-100 p-6 shadow-sm space-y-4">
        <div className="text-lg font-semibold">Find mentor slots</div>

        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="input input-bordered rounded-2xl md:col-span-1"
            placeholder="Mentor ID (ex: 3)"
            value={mentorId}
            onChange={(e) => setMentorId(e.target.value)}
          />
          <input
            className="input input-bordered rounded-2xl md:col-span-2"
            placeholder="Note (optional): e.g., Spring Security help"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="gradient" onClick={onSearch} disabled={!canSearch}>
            Search Slots
          </Button>
          <Button variant="outline" onClick={() => setNote("")}>
            Clear note
          </Button>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="rounded-3xl bg-base-100 p-10 shadow">Loading slots…</div>
      ) : isError ? (
        <div className="rounded-3xl bg-base-100 p-10 shadow">
          Failed to load slots. Check backend and mentorId.
        </div>
      ) : Array.isArray(slots) && slots.length === 0 ? (
        <div className="rounded-3xl bg-base-100 p-10 shadow text-center">
          <div className="text-lg font-semibold">No available slots</div>
          <div className="mt-2 text-base-content/70">
            Mentor has not created slots yet (or all are booked).
          </div>
        </div>
      ) : Array.isArray(slots) ? (
        <div className="grid gap-4 md:grid-cols-2">
          {slots.map((s) => (
            <div
              key={s.id}
              className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">Slot #{s.id}</div>
                <Badge variant="success">AVAILABLE</Badge>
              </div>

              <div className="mt-3 text-sm text-base-content/70 space-y-1">
                <div>
                  <span className="font-semibold">Start:</span> {fmt(s.startAt)}
                </div>
                <div>
                  <span className="font-semibold">End:</span> {fmt(s.endAt)}
                </div>
                <div>
                  <span className="font-semibold">Price:</span>{" "}
                  {s.currency || "INR"} {s.price}
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="gradient"
                  loading={book.isPending}
                  disabled={book.isPending}
                  onClick={() => book.mutate(s.id)}
                  fullWidth
                >
                  Book this slot
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}