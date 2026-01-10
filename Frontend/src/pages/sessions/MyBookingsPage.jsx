import React from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../../components/common/PageHeader.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { myBookings } from "../../api/mentorship.js";

function fmt(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function MyBookingsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: myBookings,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="My 1:1 Bookings"
        subtitle="Your confirmed sessions."
        right={<button className="btn btn-outline" onClick={() => refetch()}>Refresh</button>}
      />

      <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
        {isLoading ? (
          <div>Loading…</div>
        ) : isError ? (
          <div>Failed to load.</div>
        ) : !data?.length ? (
          <div className="text-base-content/70">No bookings yet.</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.map((b) => (
              <div key={b.id} className="rounded-3xl border border-base-300 p-5">
                <div className="flex items-center justify-between">
                  <div className="font-bold">Booking #{b.id}</div>
                  <Badge variant="success">{b.status}</Badge>
                </div>
                <div className="mt-2 text-sm text-base-content/70 space-y-1">
                  <div>Mentor ID: {b.mentorId}</div>
                  <div>Slot ID: {b.slotId}</div>
                  <div>Created: {fmt(b.createdAt)}</div>
                  {b.note ? <div>Note: {b.note}</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}