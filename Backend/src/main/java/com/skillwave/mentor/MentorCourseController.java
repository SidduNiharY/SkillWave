package com.skillwave.mentor;

import com.skillwave.catalog.Course;
import com.skillwave.catalog.CourseRepository;
import com.skillwave.user.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor/courses")
@RequiredArgsConstructor
public class MentorCourseController {

  private final MentorCourseService mentorCourseService;
  
  private final CourseRepository courseRepo;

  @GetMapping("/mine")
  public List<Course> myCourses(Authentication auth) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    requireMentor(jwt);

    Long userId = Long.parseLong(jwt.getSubject());
    return mentorCourseService.myCourses(userId);
  }

  @PostMapping
  public Course create(Authentication auth, @Valid @RequestBody CreateCourseRequest req) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    requireMentor(jwt);

    Long userId = Long.parseLong(jwt.getSubject());
    return mentorCourseService.create(userId, req);
  }

  @GetMapping("/{id}")
  public Course getOne(Authentication auth, @PathVariable("id") Long id) {
    Jwt jwt = (Jwt) auth.getPrincipal();
    requireMentor(jwt);

    Long userId = Long.parseLong(jwt.getSubject());

    Course c = courseRepo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Course not found"));

    if (!c.getInstructorId().equals(userId)) {
      throw new IllegalArgumentException("You do not own this course");
    }
    return c;
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
      String description,
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
      String description,
      String category,
      String level,
      Integer price,
      String currency,
      String thumbnailUrl,
      String youtubeUrl,
      Boolean published
  ) {}
}