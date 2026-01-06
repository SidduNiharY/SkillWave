package com.skillwave.catalog;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_lessons")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CourseLesson {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "course_id")
  private Course course;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false, length = 1024)
  private String youtubeUrl;

  private Integer orderIndex;
}