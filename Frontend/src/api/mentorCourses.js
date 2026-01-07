// src/api/mentorCourses.js
import http from "./http.js";

/**
 * Mentor: list own courses
 */
export async function listMyCourses() {
  const res = await http.get("/api/mentor/courses/mine");
  return res.data;
}

/**
 * Mentor: create course (REAL DB SAVE)
 */
export async function createCourse(payload) {
  const res = await http.post("/api/mentor/courses", payload);
  return res.data;
}

/**
 * Mentor: update course (publish/unpublish)
 */
export async function updateCourse(id, payload) {
  const res = await http.put(`/api/mentor/courses/${id}`, payload);
  return res.data;
}