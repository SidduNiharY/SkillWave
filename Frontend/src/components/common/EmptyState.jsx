import React from "react";
import Button from "../ui/Button.jsx";

export default function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-10 text-center shadow-sm">
      <h3 className="text-xl font-semibold">{title}</h3>
      {subtitle && <p className="mt-2 text-base-content/70">{subtitle}</p>}
      {actionLabel && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}