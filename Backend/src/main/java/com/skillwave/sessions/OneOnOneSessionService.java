package com.skillwave.sessions;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OneOnOneSessionService {

  private final OneOnOneSessionRepository repo;

  @Transactional
  public OneOnOneSession book(Long studentId, BookRequest req) {
    if (req.mentorId() == null) throw new IllegalArgumentException("mentorId is required");
    if (req.durationMinutes() == null || req.durationMinutes() <= 0) throw new IllegalArgumentException("durationMinutes must be > 0");
    if (req.sessionDate() == null) throw new IllegalArgumentException("sessionDate is required");
    if (req.slotTime() == null || req.slotTime().isBlank()) throw new IllegalArgumentException("slotTime is required");

    // prevent double booking on same mentor slot (only blocks ACCEPTED + PENDING)
    boolean taken = repo.existsByMentorIdAndSessionDateAndSlotTimeAndStatusIn(
        req.mentorId(),
        req.sessionDate(),
        req.slotTime().trim(),
        List.of(OneOnOneStatus.PENDING, OneOnOneStatus.ACCEPTED)
    );
    if (taken) throw new IllegalArgumentException("This slot is already booked. Choose another time.");

    OneOnOneSession s = OneOnOneSession.builder()
        .studentId(studentId)
        .mentorId(req.mentorId())
        .durationMinutes(req.durationMinutes())
        .sessionDate(req.sessionDate())
        .slotTime(req.slotTime().trim())
        .notes(req.notes() == null ? null : req.notes().trim())
        .status(OneOnOneStatus.PENDING)
        .build();

    return repo.save(s);
  }

  @Transactional(readOnly = true)
  public List<OneOnOneSession> listStudent(Long studentId) {
    return repo.findByStudentIdOrderByCreatedAtDesc(studentId);
  }

  @Transactional(readOnly = true)
  public List<OneOnOneSession> listMentor(Long mentorId) {
    return repo.findByMentorIdOrderByCreatedAtDesc(mentorId);
  }

  @Transactional
  public OneOnOneSession updateStatus(Long mentorId, Long sessionId, OneOnOneStatus status) {
    OneOnOneSession s = repo.findById(sessionId)
        .orElseThrow(() -> new IllegalArgumentException("Session not found"));

    if (!s.getMentorId().equals(mentorId)) {
      throw new IllegalArgumentException("You do not own this session");
    }

    if (status == null) throw new IllegalArgumentException("status is required");
    s.setStatus(status);
    return repo.save(s);
  }

  // DTOs
  public record BookRequest(
      Long mentorId,
      Integer durationMinutes,
      LocalDate sessionDate,
      String slotTime,
      String notes
  ) {}
}