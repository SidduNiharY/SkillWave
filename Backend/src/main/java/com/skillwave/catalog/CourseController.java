package com.skillwave.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

  private final CourseService service;

  @GetMapping
  public List<Course> list() {
    return service.listPublished();
  }

  @GetMapping("/{id}")
  public Course get(@PathVariable Long id) {
    return service.getCourse(id);
  }
}