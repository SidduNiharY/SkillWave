import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="rounded-3xl bg-base-100 p-10 text-center shadow">
      <h2 className="text-2xl font-bold">404</h2>
      <p className="mt-2 text-base-content/70">Page not found.</p>
      <div className="mt-6">
        <Link to="/">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  );
}