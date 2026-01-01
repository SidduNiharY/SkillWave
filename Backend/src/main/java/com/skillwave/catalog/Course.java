package com.skillwave.catalog;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "course")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 200)
  private String title;

  @Column(columnDefinition = "text")
  private String description;

  @Column(nullable = false)
  private Long instructorId;

  @Column(nullable = false)
  private Integer priceCents;

  @Column(nullable = false, length = 10)
  private String currency;

  @Column(nullable = false)
  private boolean published;

  /**
   * MVP: one primary video per course.
   *
   * We store YouTube info directly on the course for speed.
   * Later we can evolve into Course -> Modules -> Lessons.
   */
  @Enumerated(EnumType.STRING)
  private VideoProvider videoProvider;

  /**
   * Canonical URL (ex: https://www.youtube.com/watch?v=VIDEO_ID)
   */
  @Column(length = 1024)
  private String videoUrl;

  /**
   * Parsed provider id (ex: YouTube video id).
   */
  @Column(length = 32)
  private String videoId;

  @Enumerated(EnumType.STRING)
  private VideoVisibility videoVisibility;

  @Column(nullable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @PrePersist
  void prePersist() {
    Instant now = Instant.now();
    createdAt = now;
    updatedAt = now;
    if (currency == null) currency = "INR";
  }

  @PreUpdate
  void preUpdate() {
    updatedAt = Instant.now();
  }
}