package com.skillwave.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      // If you're using JWT (stateless) + SPA
      .csrf(AbstractHttpConfigurer::disable)
      .cors(Customizer.withDefaults())

      .authorizeHttpRequests(auth -> auth
        // ✅ allow preflight
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

        // ✅ allow auth endpoints without token
        .requestMatchers("/api/auth/**").permitAll()

        // ✅ allow oauth endpoints
        .requestMatchers("/oauth2/**", "/login/**").permitAll()

        // everything else requires auth
        .anyRequest().authenticated()
      )

      // keep your existing oauth2 login if you're using Google
      .oauth2Login(Customizer.withDefaults())

      // keep resource server jwt if you're using Bearer token protection
      .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));

    return http.build();
  }
}