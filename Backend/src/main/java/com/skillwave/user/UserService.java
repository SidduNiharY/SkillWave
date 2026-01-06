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
    final String normalizedEmail = (email == null) ? null : email.trim().toLowerCase();
    if (normalizedEmail == null || normalizedEmail.isBlank()) {
      throw new IllegalArgumentException("Email required");
    }

    return repo.findByEmail(normalizedEmail)
      .map(u -> {
        if (name != null && !name.isBlank()) u.setDisplayName(name.trim());
        if (pictureUrl != null && !pictureUrl.isBlank()) u.setPictureUrl(pictureUrl.trim());

        // ✅ enums, not String
        u.setAuthProvider(AuthProvider.GOOGLE);

        // ✅ if role missing, default to STUDENT
        if (u.getRole() == null) u.setRole(Role.STUDENT);

        return u;
      })
      .orElseGet(() -> repo.save(
        User.builder()
          .email(normalizedEmail)
          .displayName((name == null || name.isBlank()) ? "User" : name.trim())
          .pictureUrl(pictureUrl == null ? null : pictureUrl.trim())
          .authProvider(AuthProvider.GOOGLE)
          .role(Role.STUDENT)
          .build()
      ));
  }

  @Transactional
  public User createLocalUser(String email, String name, String passwordHash) {
    final String normalizedEmail = email.trim().toLowerCase();

    if (repo.existsByEmail(normalizedEmail)) {
      throw new IllegalArgumentException("Email already registered");
    }

    return repo.save(
      User.builder()
        .email(normalizedEmail)
        .displayName(name == null || name.isBlank() ? "User" : name.trim())
        .passwordHash(passwordHash)
        .authProvider(AuthProvider.LOCAL)
        .role(Role.STUDENT)
        .build()
    );
  }
}