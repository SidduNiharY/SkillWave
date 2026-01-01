import React from "react";
import clsx from "clsx";

export default function Badge({ className, variant = "neutral", ...props }) {
  const map = {
    neutral: "badge-neutral",
    success: "badge-success",
    info: "badge-info",
    warning: "badge-warning",
  };
  return <span className={clsx("badge", map[variant], className)} {...props} />;
}