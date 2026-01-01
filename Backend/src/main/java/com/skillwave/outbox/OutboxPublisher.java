package com.skillwave.outbox;

import com.skillwave.config.KafkaConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OutboxPublisher {

  private final OutboxEventRepository repo;
  private final KafkaTemplate<String, String> kafkaTemplate;

  @Scheduled(fixedDelay = 1000)
  @Transactional
  public void publishPending() {
    List<OutboxEvent> pending = repo.findTop50ByStatusOrderByCreatedAtAsc("PENDING");
    for (OutboxEvent evt : pending) {
      try {
        kafkaTemplate.send(KafkaConfig.TOPIC_DOMAIN_EVENTS, evt.getEventType(), evt.getPayload());
        evt.setStatus("PUBLISHED");
        evt.setPublishedAt(Instant.now());
      } catch (Exception ex) {
        evt.setStatus("FAILED");
      }
    }
  }
}