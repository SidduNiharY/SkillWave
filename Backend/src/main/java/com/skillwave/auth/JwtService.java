package com.skillwave.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class JwtService {

  private final JwtEncoder encoder;

  @Value("${app.jwt.issuer:skillwave}")
  private String issuer;

  @Value("${app.jwt.accessTokenMinutes:30}")
  private long accessTokenMinutes;

  public String createAccessToken(com.skillwave.user.User user) {
    Instant now = Instant.now();

    JwtClaimsSet claims = JwtClaimsSet.builder()
        .issuer(issuer)
        .issuedAt(now)
        .expiresAt(now.plusSeconds(accessTokenMinutes * 60))
        .subject(String.valueOf(user.getId()))
        .claim("email", user.getEmail())
        .claim("name", user.getDisplayName())
        .claim("role", user.getRole() == null ? null : user.getRole().name())
        .build();

    // ✅ IMPORTANT: HS256 header
    JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

    return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
  }
}