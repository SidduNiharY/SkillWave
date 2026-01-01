//package com.skillwave.user;
//
//import com.skillwave.auth.JwtService;
//import com.skillwave.user.dto.AuthResponse;
//import com.skillwave.user.dto.SignupRequest;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//public class UserAuthController {
//
//  private final UserRepository userRepo;
//  private final PasswordEncoder passwordEncoder;
//  private final JwtService jwtService;
//
//  @PostMapping("/signup")
//  public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
//    String email = req.email().trim().toLowerCase();
//
//    if (userRepo.existsByEmail(email)) {
//      return ResponseEntity.badRequest().body(new AuthResponse("Email already registered.", null));
//    }
//
//    User user = new User();
//    user.setEmail(email);
//    user.setDisplayName(req.name().trim());
//    user.setPasswordHash(passwordEncoder.encode(req.password()));
//    user.setRole("STUDENT");
//    user.setAuthProvider("LOCAL"); // optional if you keep authProvider field
//    userRepo.save(user);
//
//    String token = jwtService.createAccessToken(user);
//    return ResponseEntity.ok(new AuthResponse("Account created successfully.", token));
//  }
//}