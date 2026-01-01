package com.skillwave.config;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.jwt.JwtEncodingException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(JwtEncodingException.class)
  public ResponseEntity<?> jwt(JwtEncodingException ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
      "message", "JWT generation failed",
      "detail", safeMsg(ex)
    ));
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<?> badCredentials(BadCredentialsException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
      "message", "Invalid credentials",
      "detail", safeMsg(ex)
    ));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<?> illegalArg(IllegalArgumentException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
      "message", ex.getMessage(),
      "detail", safeMsg(ex)
    ));
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<?> dataIntegrity(DataIntegrityViolationException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
      "message", "Request failed due to database constraint",
      "detail", ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage()
    ));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> validation(MethodArgumentNotValidException ex) {
    Map<String, String> fieldErrors = new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
      "message", "Validation failed",
      "errors", fieldErrors
    ));
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<?> constraint(ConstraintViolationException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
      "message", "Validation failed",
      "detail", safeMsg(ex)
    ));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> fallback(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
      "message", "Internal server error",
      "detail", safeMsg(ex)
    ));
  }

  private static String safeMsg(Throwable ex) {
    return ex.getMessage() == null ? ex.getClass().getSimpleName() : ex.getMessage();
  }
}
