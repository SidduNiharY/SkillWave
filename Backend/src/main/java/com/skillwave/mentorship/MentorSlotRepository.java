package com.skillwave.mentorship;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface MentorSlotRepository extends JpaRepository<MentorSlot, Long> {

  List<MentorSlot> findByMentorIdOrderByStartAtAsc(Long mentorId);

  List<MentorSlot> findByMentorIdAndStatusAndStartAtAfterOrderByStartAtAsc(
    Long mentorId, SlotStatus status, Instant after
  );

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select s from MentorSlot s where s.id = :id")
  Optional<MentorSlot> findByIdForUpdate(@Param("id") Long id);
}