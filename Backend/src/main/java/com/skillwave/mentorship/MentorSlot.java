package com.skillwave.mentorship;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "mentor_slots")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MentorSlot {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "mentor_id", nullable = false)
  private Long mentorId;

  @Column(name = "start_at", nullable = false)
  private Instant startAt;

  @Column(name = "end_at", nullable = false)
  private Instant endAt;

  @Column(nullable = false)
  private Integer price;

  @Column(nullable = false)
  private String currency;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SlotStatus status;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @PrePersist
  void onCreate() {
    Instant now = Instant.now();
    createdAt = now;
    updatedAt = now;
    if (status == null) status = SlotStatus.AVAILABLE;
    if (currency == null || currency.isBlank()) currency = "INR";
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }
}