import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { createCourse } from "../../api/mentorCourses.js";
import { toast } from "sonner";

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        className="input input-bordered w-full rounded-2xl"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function MentorCourseCreatePage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "",
    price: 499,
    currency: "INR",
    thumbnailUrl: "",
    youtubeUrl: "",
  });

  const errors = useMemo(() => {
    const e = {};
    if (form.title.trim().length < 3) e.title = "Title must be 3+ characters";
    if (!form.youtubeUrl.trim()) e.youtubeUrl = "YouTube unlisted URL required";
    if (!form.price || Number(form.price) <= 0) e.price = "Price must be > 0";
    return e;
  }, [form]);

  const canNext = step === 1
    ? !errors.title && !errors.price
    : step === 2
    ? !errors.youtubeUrl
    : true;

  const create = useMutation({
    mutationFn: () =>
      createCourse({
        ...form,
        title: form.title.trim(),
        price: Number(form.price),
      }),
    onSuccess: (course) => {
      qc.invalidateQueries({ queryKey: ["mentor-courses"] });
      toast.success("Course created!");
      nav(`/mentor/courses/${course.id}/edit`);
    },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Create Course</h1>
        <p className="text-base-content/70">Step {step} of 3</p>
      </div>

      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        {step === 1 ? (
          <div className="space-y-4">
            <Field
              label="Title *"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              placeholder="Ex: Java Spring Boot Masterclass"
            />
            {errors.title ? <div className="text-error text-sm">{errors.title}</div> : null}

            <Field
              label="Subtitle"
              value={form.subtitle}
              onChange={(e) => setForm((s) => ({ ...s, subtitle: e.target.value }))}
              placeholder="Short punchy line"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Category"
                value={form.category}
                onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
                placeholder="Web Dev, Backend, DevOps…"
              />
              <Field
                label="Level"
                value={form.level}
                onChange={(e) => setForm((s) => ({ ...s, level: e.target.value }))}
                placeholder="Beginner / Intermediate / Advanced"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Price *"
                type="number"
                value={form.price}
                onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                placeholder="499"
              />
              <Field
                label="Currency"
                value={form.currency}
                onChange={(e) => setForm((s) => ({ ...s, currency: e.target.value }))}
                placeholder="INR"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Description</label>
              <textarea
                className="textarea textarea-bordered w-full rounded-2xl"
                rows={5}
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                placeholder="What will students learn?"
              />
            </div>
          </div>
        ) : step === 2 ? (
          <div className="space-y-4">
            <Field
              label="Thumbnail URL"
              value={form.thumbnailUrl}
              onChange={(e) => setForm((s) => ({ ...s, thumbnailUrl: e.target.value }))}
              placeholder="Paste image URL (later we’ll upload)"
            />

            <Field
              label="YouTube Unlisted URL *"
              value={form.youtubeUrl}
              onChange={(e) => setForm((s) => ({ ...s, youtubeUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=xxxxx"
            />
            {errors.youtubeUrl ? <div className="text-error text-sm">{errors.youtubeUrl}</div> : null}

            <div className="rounded-2xl bg-base-200 p-4 text-sm text-base-content/70">
              Tip: Upload your video to YouTube → set it to <b>Unlisted</b> → paste the link here.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-5">
              <div className="text-xs font-semibold text-base-content/60">Preview</div>
              <div className="mt-1 text-xl font-extrabold">{form.title || "Untitled"}</div>
              <div className="mt-1 text-base-content/70">{form.subtitle || "No subtitle"}</div>
              <div className="mt-3 text-sm text-base-content/70">
                Price: <span className="font-semibold">{form.currency} {form.price}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-base-200 p-4 text-sm text-base-content/70">
              After creating, you can edit and publish/unpublish from “My Courses”.
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => (step === 1 ? nav("/mentor/courses") : setStep(step - 1))}>
          Back
        </Button>

        {step < 3 ? (
          <Button variant="gradient" disabled={!canNext} onClick={() => setStep(step + 1)}>
            Next
          </Button>
        ) : (
          <Button
            variant="gradient"
            loading={create.isPending}
            disabled={create.isPending || Object.keys(errors).length > 0}
            onClick={() => create.mutate()}
          >
            Create Course
          </Button>
        )}
      </div>
    </div>
  );
}