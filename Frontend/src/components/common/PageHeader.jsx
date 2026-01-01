import React from "react";

export default function PageHeader({ title, subtitle, right }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-base-content/70">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}