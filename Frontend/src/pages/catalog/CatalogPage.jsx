import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { listCourses } from "../../api/courses.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import CatalogSkeleton from "./CatalogSkeleton.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { Card, CardBody, CardTitle } from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function CatalogPage() {
  const [q, setQ] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: listCourses,
  });

  const courses = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((c) => (c.title || "").toLowerCase().includes(term));
  }, [data, q]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader
        title="Course Catalog"
        subtitle="Recorded courses now. Live cohorts and 1:1 sessions coming next."
        right={
          <div className="join w-full md:w-[360px]">
            <button className="btn join-item btn-ghost" type="button">
              <Search size={16} />
            </button>
            <input
              className="input input-bordered join-item w-full"
              placeholder="Search courses…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        }
      />

      <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">OAuth Ready</Badge>
          <Badge variant="success">Redis Cached</Badge>
          <Badge variant="warning">Kafka Events (enabled later)</Badge>
          <div className="ml-auto text-sm text-base-content/70">
            Backend: <span className="font-medium">Spring Boot</span>
          </div>
        </div>
      </div>

      {isLoading && <CatalogSkeleton />}

      {isError && (
        <EmptyState
          title="Could not load courses"
          subtitle="Check if backend is running at http://localhost:8080 and CORS is enabled."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      )}

      {!isLoading && !isError && courses.length === 0 && (
        <EmptyState
          title="No courses found"
          subtitle="Only PUBLISHED courses appear here. Publish your course from Mentor → My Courses."
          actionLabel="Clear search"
          onAction={() => setQ("")}
        />
      )}

      {!isLoading && !isError && courses.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id} className="rounded-3xl">
              <CardBody>
                <div className="flex items-center justify-between">
                  <Badge variant={c.published ? "success" : "warning"}>
                    {c.published ? "Published" : "Draft"}
                  </Badge>

                  <span className="text-sm text-base-content/70">
                    {(c.price ?? 0)} {c.currency || "INR"}
                  </span>
                </div>

                <CardTitle className="mt-2 line-clamp-2">{c.title}</CardTitle>
                <p className="text-base-content/70 line-clamp-3">
                  {c.description || "No description yet."}
                </p>

                <div className="mt-4 flex gap-2">
                  <Link className="flex-1" to={`/courses/${c.id}`}>
                    <Button className="w-full">View</Button>
                  </Link>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => alert("Next: purchase flow + checkout UI")}
                  >
                    Buy
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}