import React, { useMemo, useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import { toast } from "sonner";

/**
 * MVP modal: generates slots locally.
 * Later: load slots from /api/mentors/{id}/availability
 */
function generateSlots() {
  // simple static slots
  return ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM", "7:00 PM"];
}

export default function BookOneOnOneModal({ open, mentor, onClose }) {
  const [duration, setDuration] = useState(30);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");

  const price = useMemo(() => {
    if (!mentor) return 0;
    return duration === 60 ? mentor.price60 : mentor.price30;
  }, [mentor, duration]);

  const slots = useMemo(() => generateSlots(date), [date]);

  const canBook = !!mentor && !!date && !!slot;

  if (!open || !mentor) return null;

  const onConfirm = async () => {
    if (!canBook) return;

    // later: call POST /api/oneonone/book
    toast.success("Session booked! (MVP UI)");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-base-300 bg-base-100 shadow-xl">
        <div className="flex items-start justify-between gap-4 p-6">
          <div>
            <div className="text-xs font-semibold text-base-content/60">Book 1-on-1</div>
            <div className="mt-1 text-2xl font-extrabold">{mentor.name}</div>
            <div className="mt-1 text-base-content/70">{mentor.title}</div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          <div className="rounded-2xl bg-base-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="info">Mentor</Badge>
              <span className="text-sm text-base-content/70">Pick duration + slot</span>
            </div>
            <div className="text-sm">
              Price: <span className="font-bold">INR {price}</span>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="text-sm font-semibold">Session duration</div>
            <div className="flex gap-2">
              <button
                className={`btn rounded-2xl ${duration === 30 ? "btn-primary" : "btn-outline"}`}
                onClick={() => setDuration(30)}
                type="button"
              >
                30 min
              </button>
              <button
                className={`btn rounded-2xl ${duration === 60 ? "btn-primary" : "btn-outline"}`}
                onClick={() => setDuration(60)}
                type="button"
              >
                60 min
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <div className="text-sm font-semibold">Choose date</div>
            <input
              type="date"
              className="input input-bordered w-full rounded-2xl"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSlot("");
              }}
            />
          </div>

          {/* Slots */}
          <div className="space-y-2">
            <div className="text-sm font-semibold">Available slots</div>
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`btn btn-sm rounded-2xl ${slot === s ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setSlot(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {!slot ? <div className="text-xs text-base-content/60">Pick one slot.</div> : null}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <div className="text-sm font-semibold">Notes (optional)</div>
            <textarea
              className="textarea textarea-bordered w-full rounded-2xl"
              rows={4}
              placeholder="What do you want to discuss? (ex: resume review, Spring Boot project, interview prep)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-base-content/70">
              {date} • {slot || "No slot selected"} • {duration} min
            </div>
            <Button variant="gradient" disabled={!canBook} onClick={onConfirm}>
              Confirm booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}