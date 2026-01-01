package com.skillwave.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
  List<Course> findByPublishedTrueOrderByCreatedAtDesc();

  List<Course> findByInstructorIdOrderByCreatedAtDesc(Long instructorId);
}