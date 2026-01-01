package com.skillwave.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository repo;

  @Transactional
  public User upsertOAuthUser(String email, String name, String pictureUrl) {
    final String normalizedEmail = email == null ? null : email.trim().toLowerCase();

    return repo.findByEmail(normalizedEmail)
      .map(u -> {
        // update only what OAuth is authoritative for
        if (name != null && !name.isBlank()) u.setDisplayName(name);
        if (pictureUrl != null && !pictureUrl.isBlank()) u.setPictureUrl(pictureUrl);

        // mark provider
        if (u.getAuthProvider() == null || u.getAuthProvider().isBlank()) {
          u.setAuthProvider("GOOGLE");
        } else {
          u.setAuthProvider("GOOGLE"); // keep simple: oauth login => GOOGLE
        }

        // ensure role exists
        if (u.getRole() == null || u.getRole().isBlank()) {
          u.setRole("STUDENT");
        }

        // keep passwordHash as-is (don’t touch it)
        return u;
      })
      .orElseGet(() -> repo.save(
        User.builder()
          .email(normalizedEmail)
          .displayName((name == null || name.isBlank()) ? "User" : name)
          .pictureUrl(pictureUrl)
          .authProvider("GOOGLE")
          .role("STUDENT")
          .build()
      ));
  }

  /**
   * Optional helper for normal email/password signup (LOCAL users).
   * Use this from AuthController if you want to keep logic centralized.
   */
  @Transactional
  public User createLocalUser(String email, String name, String passwordHash) {
    final String normalizedEmail = email.trim().toLowerCase();

    if (repo.existsByEmail(normalizedEmail)) {
      throw new IllegalArgumentException("Email already registered");
    }

    User user = User.builder()
      .email(normalizedEmail)
      .displayName(name == null || name.isBlank() ? "User" : name.trim())
      .passwordHash(passwordHash)
      .authProvider("LOCAL")
      .role("STUDENT")
      .build();

    return repo.save(user);
  }
}