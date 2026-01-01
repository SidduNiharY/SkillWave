package com.skillwave.user.dto;

public record AuthResponse(
  String message,
  String token
) {}