package com.skillwave.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

  private final CourseRepository repo;

  @Cacheable(cacheNames = "catalog")
  public List<Course> listPublished() {
    return repo.findByPublishedTrueOrderByCreatedAtDesc();
  }

  @Cacheable(cacheNames = "course", key = "#id")
  public Course getCourse(Long id) {
    return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found"));
  }
}