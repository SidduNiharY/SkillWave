import http from "./http.js";

/**
 * Mentorship API
 * Backend endpoints used:
 * - POST   /api/mentor/slots
 * - GET    /api/mentor/slots/mine
 * - GET    /api/mentor/bookings
 * - GET    /api/mentors/{mentorId}/slots
 * - POST   /api/bookings
 * - GET    /api/me/bookings
 */

// Mentor
export async function mentorCreateSlot(payload) {
  const { data } = await http.post("/api/mentor/slots", payload);
  return data;
}

export async function mentorMySlots() {
  const { data } = await http.get("/api/mentor/slots/mine");
  return data;
}

export async function mentorBookings() {
  const { data } = await http.get("/api/mentor/bookings");
  return data;
}

// Student/Public
export async function mentorAvailableSlots(mentorId) {
  const { data } = await http.get(`/api/mentors/${mentorId}/slots`);
  return data;
}

export async function bookSlot(payload) {
  const { data } = await http.post("/api/bookings", payload);
  return data;
}

export async function myBookings() {
  const { data } = await http.get("/api/me/bookings");
  return data;
}