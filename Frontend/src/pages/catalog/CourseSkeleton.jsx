import React from "react";
import Skeleton from "../../components/ui/Skeleton.jsx";

export default function CourseSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-base-100 p-6 shadow">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="mt-3 h-4 w-1/2" />
        <Skeleton className="mt-5 h-24 w-full" />
        <div className="mt-6 flex gap-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
      <div className="rounded-3xl bg-base-100 p-6 shadow">
        <Skeleton className="h-5 w-40" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}