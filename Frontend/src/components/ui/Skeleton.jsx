import React from "react";
import clsx from "clsx";

export default function Skeleton({ className }) {
  return <div className={clsx("animate-pulse rounded-md bg-base-300/60", className)} />;
}