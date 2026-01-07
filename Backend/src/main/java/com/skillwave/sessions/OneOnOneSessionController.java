package com.skillwave.sessions;

import com.skillwave.user.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OneOnOneSessionController {

  private final OneOnOneSessionService service;

  // Student books
  @PostMapping("/api/oneonone/book")
  public OneOnOneSession book(Authentication auth, @RequestBody OneOnOneSessionService.BookRequest req) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    Long studentId = Long.parseLong(jwt.getSubject());
    return service.book(studentId, req);
  }

  // Student sees their bookings
  @GetMapping("/api/me/sessions")
  public List<OneOnOneSession> mySessions(Authentication auth) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    Long studentId = Long.parseLong(jwt.getSubject());
    return service.listStudent(studentId);
  }

  // Mentor sees requests
  @GetMapping("/api/mentor/sessions")
  public List<OneOnOneSession> mentorSessions(Authentication auth) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    requireMentor(jwt);
    Long mentorId = Long.parseLong(jwt.getSubject());
    return service.listMentor(mentorId);
  }

  // Mentor accepts/rejects/cancels
  @PutMapping("/api/mentor/sessions/{id}")
  public OneOnOneSession updateStatus(
      Authentication auth,
      @PathVariable("id") Long id,
      @RequestBody UpdateStatusRequest req
  ) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    requireMentor(jwt);
    Long mentorId = Long.parseLong(jwt.getSubject());
    return service.updateStatus(mentorId, id, req.status());
  }

  private static void requireMentor(Jwt jwt) {
    String role = jwt.getClaimAsString("role");
    if (role == null) throw new IllegalArgumentException("Missing role claim");
    Role r = Role.valueOf(role);
    if (r != Role.MENTOR && r != Role.ADMIN) throw new IllegalArgumentException("Mentor access required");
  }

  public record UpdateStatusRequest(OneOnOneStatus status) {}
}