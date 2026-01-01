package com.skillwave.payments;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillwave.outbox.OutboxEvent;
import com.skillwave.outbox.OutboxEventRepository;
import com.skillwave.outbox.OutboxTypes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PurchaseService {

  private final OutboxEventRepository outboxRepo;
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Transactional
  public Map<String, Object> fakePurchase(Long userId, Long courseId) {
    // In real integration: create payment intent/order, verify webhook, then emit success.
    String payload;
    try {
      payload = objectMapper.writeValueAsString(Map.of(
        "userId", userId,
        "courseId", courseId,
        "status", "SUCCEEDED"
      ));
    } catch (Exception e) {
      throw new RuntimeException(e);
    }

    outboxRepo.save(OutboxEvent.builder()
      .aggregateType(OutboxTypes.AGG_PAYMENT)
      .aggregateId(userId + ":" + courseId)
      .eventType(OutboxTypes.EVT_PAYMENT_SUCCEEDED)
      .payload(payload)
      .status("PENDING")
      .build()
    );

    return Map.of("ok", true, "message", "Fake purchase stored; event will publish via outbox");
  }
}