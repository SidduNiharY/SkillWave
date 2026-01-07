package com.skillwave.catalog;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "courses")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  private String subtitle;

  @Column(columnDefinition = "text")
  private String description;

  private String category;

  private String level;

  @Column(nullable = false)
  private Integer price;

  @Column(nullable = false)
  private String currency;

  private String thumbnailUrl;

  @Column(nullable = false)
  private boolean published;

  // ✅ SINGLE SOURCE OF TRUTH
  @Column(name = "instructor_id", nullable = false)
  private Long instructorId;

  // 🎥 Video
  @Enumerated(EnumType.STRING)
  private VideoProvider videoProvider;

  private String videoUrl;

  private String videoId;

  @Enumerated(EnumType.STRING)
  private VideoVisibility videoVisibility;

  @Column(nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @Column(nullable = false)
  private OffsetDateTime updatedAt;

  @PrePersist
  void onCreate() {
    createdAt = OffsetDateTime.now();
    updatedAt = createdAt;
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = OffsetDateTime.now();
  }
}