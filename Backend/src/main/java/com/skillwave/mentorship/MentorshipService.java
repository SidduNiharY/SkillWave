package com.skillwave.mentorship;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorshipService {

  private final MentorSlotRepository slotRepo;
  private final BookingRepository bookingRepo;

  @Transactional
  public MentorSlot createSlot(Long mentorId, CreateSlotRequest req) {
    if (req.startAt().isAfter(req.endAt()) || req.startAt().equals(req.endAt())) {
      throw new IllegalArgumentException("Invalid slot time range");
    }
    if (req.price() == null || req.price() <= 0) {
      throw new IllegalArgumentException("Price must be > 0");
    }

    MentorSlot slot = MentorSlot.builder()
      .mentorId(mentorId)
      .startAt(req.startAt())
      .endAt(req.endAt())
      .price(req.price())
      .currency(req.currency() == null || req.currency().isBlank() ? "INR" : req.currency().trim().toUpperCase())
      .status(SlotStatus.AVAILABLE)
      .build();

    return slotRepo.save(slot);
  }

  @Transactional(readOnly = true)
  public List<MentorSlot> mySlots(Long mentorId) {
    return slotRepo.findByMentorIdOrderByStartAtAsc(mentorId);
  }

  @Transactional(readOnly = true)
  public List<MentorSlot> availableSlotsForMentor(Long mentorId) {
    return slotRepo.findByMentorIdAndStatusAndStartAtAfterOrderByStartAtAsc(
      mentorId, SlotStatus.AVAILABLE, Instant.now()
    );
  }

  /**
   * Double-book safe:
   * - lock slot row
   * - check status
   * - create booking
   * - mark slot BOOKED
   */
  @Transactional
  public Booking bookSlot(Long studentId, BookSlotRequest req) {
    MentorSlot slot = slotRepo.findByIdForUpdate(req.slotId())
      .orElseThrow(() -> new IllegalArgumentException("Slot not found"));

    if (slot.getStatus() != SlotStatus.AVAILABLE) {
      throw new IllegalArgumentException("Slot is not available");
    }
    if (slot.getStartAt().isBefore(Instant.now())) {
      throw new IllegalArgumentException("Slot already started");
    }

    Booking booking = Booking.builder()
      .slotId(slot.getId())
      .mentorId(slot.getMentorId())
      .studentId(studentId)
      .status(BookingStatus.CONFIRMED)
      .note(req.note())
      .build();

    Booking saved = bookingRepo.save(booking);

    slot.setStatus(SlotStatus.BOOKED);
    slotRepo.save(slot);

    return saved;
  }

  @Transactional(readOnly = true)
  public List<Booking> myBookingsStudent(Long studentId) {
    return bookingRepo.findByStudentIdOrderByCreatedAtDesc(studentId);
  }

  @Transactional(readOnly = true)
  public List<Booking> myBookingsMentor(Long mentorId) {
    return bookingRepo.findByMentorIdOrderByCreatedAtDesc(mentorId);
  }

  // --- DTOs ---
  public record CreateSlotRequest(Instant startAt, Instant endAt, Integer price, String currency) {}
  public record BookSlotRequest(Long slotId, String note) {}
}