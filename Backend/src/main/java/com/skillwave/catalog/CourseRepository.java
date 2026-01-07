package com.skillwave.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

  // ✅ public catalog
  List<Course> findByPublishedTrueOrderByCreatedAtDesc();

  // ✅ public single course (published only)
  Optional<Course> findByIdAndPublishedTrue(Long id);

  // ✅ mentor area (keep ONE naming: instructorId OR mentorId)
  List<Course> findByInstructorIdOrderByCreatedAtDesc(Long instructorId);
}