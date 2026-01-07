import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../../api/courses.js";
import { motion } from "framer-motion";
import PageHeader from "../../components/common/PageHeader.jsx";
import CourseSkeleton from "./CourseSkeleton.jsx";
import { Card, CardBody, CardTitle } from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { toast } from "sonner";

export default function CoursePage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(id),
  });

  if (isLoading) return <CourseSkeleton />;

  if (isError || !data) {
    return (
      <div className="rounded-3xl bg-base-100 p-10 text-center shadow">
        <h2 className="text-xl font-semibold">Course not found</h2>
        <p className="mt-2 text-base-content/70">Return to catalog.</p>
        <div className="mt-6">
          <Link to="/explore">
            <Button>Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Support both backend shapes:
  // - new backend: price (INR)
  // - old backend: priceCents (paise/cents)
  const rawPrice =
    data.price != null
      ? Number(data.price)
      : data.priceCents != null
      ? Number(data.priceCents) / 100
      : 0;

  const priceText = Number.isFinite(rawPrice) ? rawPrice.toFixed(2) : "0.00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <PageHeader
        title="Course Details"
        subtitle="This is a polished course page. Next we’ll plug in checkout + enrollment."
        right={
          <Link to="/explore">
            <Button variant="ghost">← Back to catalog</Button>
          </Link>
        }
      />

      <Card className="rounded-3xl">
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={data.published ? "success" : "warning"}>
                {data.published ? "Published" : "Draft"}
              </Badge>
              <span className="text-sm text-base-content/70">
                Course #{data.id}
              </span>
            </div>

            <div className="text-right">
              <div className="text-sm text-base-content/70">Price</div>
              <div className="text-2xl font-bold">
                {priceText} {data.currency || "INR"}
              </div>
            </div>
          </div>

          <CardTitle className="mt-3 text-2xl">{data.title}</CardTitle>
          <p className="mt-2 text-base-content/70">
            {data.description || "No description yet."}
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              className="sm:w-60"
              onClick={() =>
                toast.message(
                  "Next: connect to /api/purchases and unlock access."
                )
              }
            >
              Buy now
            </Button>
            <Button
              variant="outline"
              className="sm:w-60"
              onClick={() => toast.info("Next: add lessons + player UI.")}
            >
              Preview lessons
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="rounded-3xl bg-base-100 p-6 shadow">
        <h3 className="text-lg font-semibold">What’s next</h3>
        <ul className="mt-3 space-y-2 text-base-content/70">
          <li>• Add “Enrollments” table (purchase → access)</li>
          <li>• Checkout page + payment gateway</li>
          <li>• Lessons player + progress tracking</li>
          <li>• Live sessions module</li>
        </ul>
      </div>
    </motion.div>
  );
}