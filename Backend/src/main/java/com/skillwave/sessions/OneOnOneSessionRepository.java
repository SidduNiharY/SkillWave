package com.skillwave.sessions;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface OneOnOneSessionRepository extends JpaRepository<OneOnOneSession, Long> {
  List<OneOnOneSession> findByStudentIdOrderByCreatedAtDesc(Long studentId);
  List<OneOnOneSession> findByMentorIdOrderByCreatedAtDesc(Long mentorId);

  boolean existsByMentorIdAndSessionDateAndSlotTimeAndStatusIn(
      Long mentorId,
      LocalDate sessionDate,
      String slotTime,
      List<OneOnOneStatus> status
  );
}