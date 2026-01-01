package com.skillwave.outbox;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "outbox_event")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class OutboxEvent {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String aggregateType;

  @Column(nullable = false)
  private String aggregateId;

  @Column(nullable = false)
  private String eventType;

  @Column(nullable = false, columnDefinition = "jsonb")
  private String payload;

  @Column(nullable = false)
  private String status; // PENDING, PUBLISHED, FAILED

  @Column(nullable = false)
  private Instant createdAt;

  private Instant publishedAt;

  @PrePersist
  void prePersist() {
    createdAt = Instant.now();
    if (status == null) status = "PENDING";
  }
}