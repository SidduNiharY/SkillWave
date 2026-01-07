package com.skillwave.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

  private final CourseRepository courseRepo;

  // ✅ Public catalog: only published
  @GetMapping
  public List<Course> listPublished() {
    return courseRepo.findByPublishedTrueOrderByCreatedAtDesc();
  }

  // ✅ Public course page: only published
  @GetMapping("/{id}")
  public Course getPublished(@PathVariable("id") Long id) {
    return courseRepo.findByIdAndPublishedTrue(id)
      .orElseThrow(() -> new IllegalArgumentException("Course not found"));
  }
}