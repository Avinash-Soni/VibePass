package com.VibePass.ticket.repositories;

import com.VibePass.ticket.domain.entities.Event;
import com.VibePass.ticket.domain.entities.Staff;
import com.VibePass.ticket.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StaffRepository extends JpaRepository<Staff, UUID> {

    // Checks if a record exists for this specific user-event combination
    // This is the core logic for multi-event assignment
    boolean existsByUserAndEventId(User user, UUID eventId);

    // Helper for service-level checks using the Event object
    boolean existsByUserAndEvent(User user, Event event);

    // Used to find specific assignment details
    Optional<Staff> findByUserAndEventId(User user, UUID eventId);

    // NOTE: findByUser(User user) might throw an exception now
    // if a user is assigned to MORE than one event.
    // Use findByUserId(UUID userId) returning a List<Staff> instead if needed.

    List<Staff> findByEvent(Event event);
}