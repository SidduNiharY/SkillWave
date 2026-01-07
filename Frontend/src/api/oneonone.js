import http from "../api/http.js";

export async function bookOneOnOne(payload) {
  const { data } = await http.post("/api/oneonone/book", payload);
  return data;
}

export async function listMySessions() {
  const { data } = await http.get("/api/me/sessions");
  return data;
}

export async function listMentorSessions() {
  const { data } = await http.get("/api/mentor/sessions");
  return data;
}

export async function updateSessionStatus(id, status) {
  const { data } = await http.put(`/api/mentor/sessions/${id}`, { status });
  return data;
}