package com.skillwave.auth;

import com.skillwave.user.AuthProvider;
import com.skillwave.user.Role;
import com.skillwave.user.User;
import com.skillwave.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepo;
  private final PasswordEncoder encoder;
  private final JwtService jwtService;

  @Transactional
  public Map<String, Object> signup(AuthController.SignupRequest req) {

    String email = req.email().trim().toLowerCase();

    if (userRepo.existsByEmail(email)) {
      throw new IllegalArgumentException("Email already registered.");
    }

    Role role = (req.role() == null) ? Role.STUDENT : req.role();

    User user = User.builder()
      .email(email)
      .displayName(req.name().trim())
      .passwordHash(encoder.encode(req.password()))
      .authProvider(AuthProvider.LOCAL)   // ✅ enum (NOT NULL safe)
      .role(role)                         // ✅ enum (Student/Mentor)
      .build();

    userRepo.save(user);

    // ✅ If this fails, transaction will rollback because JwtEncodingException is RuntimeException
    String token = jwtService.createAccessToken(user);

    return Map.of(
      "message", "Account created successfully.",
      "token", token,
      "user", Map.of(
        "id", user.getId(),
        "displayName", user.getDisplayName(),
        "email", user.getEmail(),
        "role", user.getRole().name(),
        "authProvider", user.getAuthProvider().name()
      )
    );
  }

  @Transactional(readOnly = true)
  public Map<String, Object> login(AuthController.LoginRequest req) {
    String email = req.email().trim().toLowerCase();
    User user = userRepo.findByEmail(email)
      .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

    if (user.getAuthProvider() != AuthProvider.LOCAL) {
      throw new BadCredentialsException("Use Google login for this account");
    }
    if (user.getPasswordHash() == null || !encoder.matches(req.password(), user.getPasswordHash())) {
      throw new BadCredentialsException("Invalid email or password");
    }

    String token = jwtService.createAccessToken(user);
    return Map.of(
      "message", "Login successful",
      "token", token,
      "user", Map.of(
        "id", user.getId(),
        "displayName", user.getDisplayName(),
        "email", user.getEmail(),
        "role", user.getRole().name(),
        "authProvider", user.getAuthProvider().name()
      )
    );
  }
}