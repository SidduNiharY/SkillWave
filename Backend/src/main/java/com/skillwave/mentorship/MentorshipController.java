package com.skillwave.mentorship;

import com.skillwave.user.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MentorshipController {

  private final MentorshipService service;

  // ---- Mentor APIs ----

  @PostMapping("/mentor/slots")
  public MentorSlot createSlot(Authentication auth, @RequestBody MentorshipService.CreateSlotRequest req) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    requireMentor(jwt);
    Long mentorId = Long.parseLong(jwt.getSubject());
    return service.createSlot(mentorId, req);
  }

  @GetMapping("/mentor/slots/mine")
  public List<MentorSlot> mySlots(Authentication auth) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    requireMentor(jwt);
    Long mentorId = Long.parseLong(jwt.getSubject());
    return service.mySlots(mentorId);
  }

  @GetMapping("/mentor/bookings")
  public List<Booking> mentorBookings(Authentication auth) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    requireMentor(jwt);
    Long mentorId = Long.parseLong(jwt.getSubject());
    return service.myBookingsMentor(mentorId);
  }

  // ---- Public/Student APIs ----

  @GetMapping("/mentors/{mentorId}/slots")
  public List<MentorSlot> availableSlots(@PathVariable("mentorId") Long mentorId) {
    return service.availableSlotsForMentor(mentorId);
  }

  @PostMapping("/bookings")
  public Booking book(Authentication auth, @RequestBody MentorshipService.BookSlotRequest req) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    Long studentId = Long.parseLong(jwt.getSubject());
    return service.bookSlot(studentId, req);
  }

  @GetMapping("/me/bookings")
  public List<Booking> myBookings(Authentication auth) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    Long studentId = Long.parseLong(jwt.getSubject());
    return service.myBookingsStudent(studentId);
  }

  // ---- Helpers ----
  private static void requireMentor(Jwt jwt) {
    String role = jwt.getClaimAsString("role");
    if (role == null) throw new IllegalArgumentException("Missing role claim");

    Role r = Role.valueOf(role);
    if (r != Role.MENTOR && r != Role.ADMIN) {
      throw new IllegalArgumentException("Mentor access required");
    }
  }
}