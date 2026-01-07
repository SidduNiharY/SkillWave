package com.skillwave.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

  private final CourseRepository courseRepo;

  /**
   * Public catalog list (students see only published courses)
   */
  @Transactional(readOnly = true)
  public List<Course> listPublished() {
    return courseRepo.findByPublishedTrueOrderByCreatedAtDesc();
  }

  /**
   * Mentor list (mentor sees their own drafts + published)
   */
  @Transactional(readOnly = true)
  public List<Course> listForMentor(Long instructorId) {
    return courseRepo.findByInstructorIdOrderByCreatedAtDesc(instructorId);
  }
}