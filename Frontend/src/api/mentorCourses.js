import { http } from "./http.js";

export async function listMyCourses() {
  const { data } = await http.get("/api/mentor/courses/mine");
  return data;
}

export async function createCourse(payload) {
  const { data } = await http.post("/api/mentor/courses", payload);
  return data;
}

export async function updateCourse(id, payload) {
  const { data } = await http.put(`/api/mentor/courses/${id}`, payload);
  return data;
}