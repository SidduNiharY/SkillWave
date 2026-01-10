package com.skillwave.mentorship;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
  List<Booking> findByStudentIdOrderByCreatedAtDesc(Long studentId);
  List<Booking> findByMentorIdOrderByCreatedAtDesc(Long mentorId);
}