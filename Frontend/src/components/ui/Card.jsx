import React from "react";
import clsx from "clsx";

export function Card({ className, ...props }) {
  return <div className={clsx("card bg-base-100 shadow-xl", className)} {...props} />;
}
export function CardBody({ className, ...props }) {
  return <div className={clsx("card-body", className)} {...props} />;
}
export function CardTitle({ className, ...props }) {
  return <h2 className={clsx("card-title", className)} {...props} />;
}