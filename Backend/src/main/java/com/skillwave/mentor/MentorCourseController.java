package com.skillwave.mentor;

import com.skillwave.catalog.Course;
import com.skillwave.catalog.CourseRepository;
import com.skillwave.catalog.VideoProvider;
import com.skillwave.catalog.VideoVisibility;
import com.skillwave.user.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Mentor endpoints for creating/updating courses.
 * MVP: a course points to a single YouTube unlisted video.
 */
@RestController
@RequestMapping("/api/mentor/courses")
@RequiredArgsConstructor
public class MentorCourseController {

  private final CourseRepository courseRepo;

  @GetMapping("/mine")
  public List<Course> myCourses(Authentication auth) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    Long userId = Long.parseLong(jwt.getSubject());
    requireMentor(jwt);
    return courseRepo.findByInstructorId(userId);
  }

  @PostMapping
  public Course create(Authentication auth, @RequestBody CreateCourseRequest req) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    Long userId = Long.parseLong(jwt.getSubject());
    requireMentor(jwt);

    YoutubeParse y = YoutubeParse.from(req.youtubeUrl());

    Course c = Course.builder()
      .title(req.title().trim())
      .subtitle(req.subtitle() == null ? null : req.subtitle().trim())
      .category(req.category() == null ? null : req.category().trim())
      .level(req.level() == null ? null : req.level().trim())
      .price(req.price())
      .currency(req.currency() == null ? "INR" : req.currency().trim().toUpperCase())
      .thumbnailUrl(req.thumbnailUrl() == null ? null : req.thumbnailUrl().trim())
      .published(false)
      .instructorId(userId)
      .videoProvider(VideoProvider.YOUTUBE)
      .videoUrl(y.canonicalUrl())
      .videoId(y.videoId())
      .videoVisibility(VideoVisibility.UNLISTED)
      .build();

    return courseRepo.save(c);
  }

  @PutMapping("/{id}")
  public Course update(Authentication auth, @PathVariable Long id, @RequestBody UpdateCourseRequest req) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    Long userId = Long.parseLong(jwt.getSubject());
    requireMentor(jwt);

    Course c = courseRepo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Course not found"));

    if (!c.getInstructorId().equals(userId)) {
      throw new IllegalArgumentException("You do not own this course");
    }

    if (req.title() != null && !req.title().isBlank()) c.setTitle(req.title().trim());
    if (req.subtitle() != null) c.setSubtitle(req.subtitle().isBlank() ? null : req.subtitle().trim());
    if (req.category() != null) c.setCategory(req.category().isBlank() ? null : req.category().trim());
    if (req.level() != null) c.setLevel(req.level().isBlank() ? null : req.level().trim());
    if (req.price() != null) c.setPrice(req.price());
    if (req.currency() != null && !req.currency().isBlank()) c.setCurrency(req.currency().trim().toUpperCase());
    if (req.thumbnailUrl() != null) c.setThumbnailUrl(req.thumbnailUrl().isBlank() ? null : req.thumbnailUrl().trim());

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

    if (req.published() != null) {
      c.setPublished(req.published());
    }

    return courseRepo.save(c);
  }

  private static void requireMentor(Jwt jwt) {
    String role = jwt.getClaimAsString("role");
    if (role == null) throw new IllegalArgumentException("Missing role claim");
    Role r = Role.valueOf(role);
    if (r != Role.MENTOR && r != Role.ADMIN) {
      throw new IllegalArgumentException("Mentor access required");
    }
  }

  public record CreateCourseRequest(
    @NotBlank String title,
    String subtitle,
    String category,
    String level,
    @NotNull Integer price,
    String currency,
    String thumbnailUrl,
    @NotBlank String youtubeUrl
  ) {}

  public record UpdateCourseRequest(
    String title,
    String subtitle,
    String category,
    String level,
    Integer price,
    String currency,
    String thumbnailUrl,
    String youtubeUrl,
    Boolean published
  ) {}
}
