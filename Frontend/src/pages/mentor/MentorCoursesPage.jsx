import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { listMyCourses, updateCourse } from "../../api/mentorCourses.js";
import { toast } from "sonner";

function CourseCard({ c, onTogglePublish }) {
  return (
    <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold">{c.title}</h3>
            {c.published ? (
              <Badge variant="success">Published</Badge>
            ) : (
              <Badge variant="warning">Draft</Badge>
            )}
          </div>

          {c.subtitle ? (
            <p className="mt-1 text-sm text-base-content/70 line-clamp-2">{c.subtitle}</p>
          ) : null}

          <div className="mt-3 text-sm text-base-content/70">
            Price: <span className="font-semibold">{c.currency} {c.price}</span>
          </div>
        </div>

        {c.thumbnailUrl ? (
          <img
            src={c.thumbnailUrl}
            alt="thumbnail"
            className="h-16 w-24 rounded-2xl object-cover border border-base-300"
          />
        ) : (
          <div className="h-16 w-24 rounded-2xl border border-dashed border-base-300 grid place-items-center text-xs text-base-content/50">
            No thumbnail
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link to={`/mentor/courses/${c.id}/edit`}>
          <Button size="sm" variant="outline">Edit</Button>
        </Link>

        <Button
          size="sm"
          variant={c.published ? "outline" : "gradient"}
          onClick={() => onTogglePublish(c)}
        >
          {c.published ? "Unpublish" : "Publish"}
        </Button>
      </div>
    </div>
  );
}

export default function MentorCoursesPage() {
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mentor-courses"],
    queryFn: listMyCourses,
  });

  const togglePub = useMutation({
    mutationFn: ({ id, published }) => updateCourse(id, { published }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mentor-courses"] });
      toast.success("Updated");
    },
  });

  const onTogglePublish = (c) => {
    togglePub.mutate({ id: c.id, published: !c.published });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">My Courses</h1>
          <p className="text-base-content/70">Create, edit, and publish your courses.</p>
        </div>

        <Link to="/mentor/courses/new">
          <Button variant="gradient">+ Create Course</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-3xl bg-base-100 p-10 shadow">Loading…</div>
      ) : isError ? (
        <div className="rounded-3xl bg-base-100 p-10 shadow">
          Failed to load courses.
        </div>
      ) : !data?.length ? (
        <div className="rounded-3xl bg-base-100 p-10 shadow text-center">
          <div className="text-lg font-semibold">No courses yet</div>
          <div className="mt-2 text-base-content/70">Create your first course and publish it.</div>
          <div className="mt-6">
            <Link to="/mentor/courses/new">
              <Button variant="gradient">Create Course</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((c) => (
            <CourseCard key={c.id} c={c} onTogglePublish={onTogglePublish} />
          ))}
        </div>
      )}
    </div>
  );
}