package com.skillwave.payments;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

  private final PurchaseService service;

  @PostMapping
  public Object purchase(@AuthenticationPrincipal Jwt jwt, @RequestBody PurchaseRequest req) {
    // subject contains userId (set by our JWT issuer)
    String userId = jwt.getSubject();
    return service.fakePurchase(Long.parseLong(userId), req.courseId);
  }

  @Data
  public static class PurchaseRequest {
    @NotNull
    private Long courseId;
  }
}