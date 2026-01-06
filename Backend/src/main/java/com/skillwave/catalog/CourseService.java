package com.skillwave.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

  private final CourseRepository repo;

  public List<Course> listPublished() {
    return repo.findByPublishedTrueOrderByCreatedAtDesc();
  }

  public Course getCourse(Long id) {
    return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found"));
  }
}