package com.skillwave.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MeController {

  private final UserRepository userRepo;

  @GetMapping("/me")
  public MeResponse me(Authentication auth) {
    // You can customize based on your security principal implementation.
    // For now we assume your JWT authentication sets email as name
    String email = auth.getName();

    User user = userRepo.findByEmail(email.toLowerCase())
      .orElseThrow();

    return MeResponse.from(user);
  }

  public record MeResponse(Long id, String displayName, String email, Role role, AuthProvider authProvider) {
    public static MeResponse from(User u) {
      return new MeResponse(u.getId(), u.getDisplayName(), u.getEmail(), u.getRole(), u.getAuthProvider());
    }
  }
}