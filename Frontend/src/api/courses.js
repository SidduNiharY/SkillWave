import http from "./http";

export async function listCourses() {
  const res = await http.get("/api/courses");
  return res.data;
}

export async function getCourse(id) {
  const res = await http.get(`/api/courses/${id}`);
  return res.data;
}

export async function getMe() {
  const res = await http.get("/api/me");
  return res.data;
}