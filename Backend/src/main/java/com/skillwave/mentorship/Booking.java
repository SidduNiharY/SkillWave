package com.skillwave.mentorship;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "bookings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Booking {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "slot_id", nullable = false, unique = true)
  private Long slotId;

  @Column(name = "mentor_id", nullable = false)
  private Long mentorId;

  @Column(name = "student_id", nullable = false)
  private Long studentId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private BookingStatus status;

  @Column(columnDefinition = "text")
  private String note;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    createdAt = Instant.now();
    if (status == null) status = BookingStatus.CONFIRMED;
  }
}