package com.skillwave.auth;

import com.skillwave.user.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  /**
   * role is optional. If not provided, backend will default to STUDENT.
   * For mentor signup: send role = "MENTOR".
   */
  public record SignupRequest(
    @NotBlank String name,
    @Email @NotBlank String email,
    @Size(min = 6) String password,
    Role role
  ) {}

  public record LoginRequest(
    @Email @NotBlank String email,
    @NotBlank String password
  ) {}

  @PostMapping("/signup")
  public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody SignupRequest req) {
    return ResponseEntity.ok(authService.signup(req));
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest req) {
    return ResponseEntity.ok(authService.login(req));
  }
}
