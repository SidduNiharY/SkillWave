package com.skillwave.catalog;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 200)
  private String title;

  @Column(length = 400)
  private String subtitle;

  @Column(columnDefinition = "text")
  private String description;

  @Column(length = 80)
  private String category;

  @Column(length = 40)
  private String level;

  @Column(nullable = false)
  private Long instructorId;

  @Column(nullable = false)
  private Integer price;

  @Column(nullable = false, length = 10)
  private String currency;

  @Column(length = 1024)
  private String thumbnailUrl;

  @Column(nullable = false)
  private boolean published;

  @Enumerated(EnumType.STRING)
  private VideoProvider videoProvider;

  @Column(length = 1024)
  private String videoUrl;

  @Column(length = 32)
  private String videoId;

  @Enumerated(EnumType.STRING)
  private VideoVisibility videoVisibility;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @PrePersist
  void prePersist() {
    Instant now = Instant.now();
    createdAt = now;
    updatedAt = now;

    if (currency == null || currency.isBlank()) currency = "INR";
  }

  @PreUpdate
  void preUpdate() {
    updatedAt = Instant.now();
    if (currency == null || currency.isBlank()) currency = "INR";
  }
}