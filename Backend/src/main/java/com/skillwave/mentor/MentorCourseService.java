package com.skillwave.mentor;

import com.skillwave.catalog.Course;
import com.skillwave.catalog.CourseRepository;
import com.skillwave.catalog.VideoProvider;
import com.skillwave.catalog.VideoVisibility;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorCourseService {

  private final CourseRepository courseRepo;

  @Transactional(readOnly = true)
  public List<Course> myCourses(Long instructorId) {
    return courseRepo.findByInstructorIdOrderByCreatedAtDesc(instructorId);
  }

  @Transactional
  public Course create(Long instructorId, MentorCourseController.CreateCourseRequest req) {

    YoutubeParse y = YoutubeParse.from(req.youtubeUrl());

    Course c = Course.builder()
      .title(req.title().trim())
      .subtitle(trimOrNull(req.subtitle()))
      .description(trimOrNull(req.description()))
      .category(trimOrNull(req.category()))
      .level(trimOrNull(req.level()))
      .price(req.price())
      .currency((req.currency() == null || req.currency().isBlank())
        ? "INR"
        : req.currency().trim().toUpperCase()
      )
      .thumbnailUrl(trimOrNull(req.thumbnailUrl()))
      .published(false)
      .instructorId(instructorId)
      .videoProvider(VideoProvider.YOUTUBE)
      .videoUrl(y.canonicalUrl())
      .videoId(y.videoId())
      .videoVisibility(VideoVisibility.UNLISTED)
      .build();

    return courseRepo.save(c);
  }

  @Transactional
  public Course update(Long instructorId, Long courseId, MentorCourseController.UpdateCourseRequest req) {

    Course c = courseRepo.findById(courseId)
      .orElseThrow(() -> new IllegalArgumentException("Course not found"));

    if (!c.getInstructorId().equals(instructorId)) {
      throw new IllegalArgumentException("You do not own this course");
    }

    if (req.title() != null && !req.title().isBlank()) c.setTitle(req.title().trim());
    if (req.subtitle() != null) c.setSubtitle(trimOrNull(req.subtitle()));
    if (req.description() != null) c.setDescription(trimOrNull(req.description()));
    if (req.category() != null) c.setCategory(trimOrNull(req.category()));
    if (req.level() != null) c.setLevel(trimOrNull(req.level()));
    if (req.price() != null) c.setPrice(req.price());
    if (req.currency() != null && !req.currency().isBlank()) c.setCurrency(req.currency().trim().toUpperCase());
    if (req.thumbnailUrl() != null) c.setThumbnailUrl(trimOrNull(req.thumbnailUrl()));

    if (req.youtubeUrl() != null) {
      if (req.youtubeUrl().isBlank()) {
        c.setVideoProvider(null);
        c.setVideoUrl(null);
        c.setVideoId(null);
        c.setVideoVisibility(null);
      } else {
        YoutubeParse y = YoutubeParse.from(req.youtubeUrl());
        c.setVideoProvider(VideoProvider.YOUTUBE);
        c.setVideoUrl(y.canonicalUrl());
        c.setVideoId(y.videoId());
        c.setVideoVisibility(VideoVisibility.UNLISTED);
      }
    }

    if (req.published() != null) c.setPublished(req.published());

    return courseRepo.save(c);
  }

  private static String trimOrNull(String s) {
    if (s == null) return null;
    String t = s.trim();
    return t.isBlank() ? null : t;
  }
}