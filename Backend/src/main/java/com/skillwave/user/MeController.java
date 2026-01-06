package com.skillwave.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MeController {

  private final UserRepository userRepo;

  @GetMapping("/me")
  public MeResponse me(Authentication auth) {

    Jwt jwt = (Jwt) auth.getPrincipal();

    // ✅ JWT subject = user ID
    Long userId = Long.parseLong(jwt.getSubject());

    User user = userRepo.findById(userId)
      .orElseThrow(() -> new IllegalStateException("User not found for token"));

    return MeResponse.from(user);
  }

  public record MeResponse(
    Long id,
    String displayName,
    String email,
    String role,
    String authProvider
  ) {
    public static MeResponse from(User u) {
      return new MeResponse(
        u.getId(),
        u.getDisplayName(),
        u.getEmail(),
        u.getRole().name(),
        u.getAuthProvider().name()
      );
    }
  }
}