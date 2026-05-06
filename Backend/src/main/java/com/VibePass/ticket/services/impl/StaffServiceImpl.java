package com.VibePass.ticket.services.impl;

import com.VibePass.ticket.domain.dtos.StaffCreateRequest;
import com.VibePass.ticket.domain.dtos.StaffResponseDto;
import com.VibePass.ticket.domain.entities.*;
import com.VibePass.ticket.repositories.*;
import com.VibePass.ticket.services.StaffService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<StaffResponseDto> getStaffByEvent(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        return staffRepository.findByEvent(event)
                .stream()
                .map(staff -> new StaffResponseDto(
                        staff.getUser().getId(),
                        staff.getUser().getName(),
                        staff.getUser().getEmail()
                ))
                .toList();
    }

    @Override
    @Transactional // ✅ Ensure both operations succeed or fail together
    public void createAndAssignStaff(UUID eventId, StaffCreateRequest request) {
        // 1. Get the Event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // 2. Find existing user by email or create a new one
        User staffUser = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    // This block runs ONLY if the user doesn't exist yet
                    User newUser = new User();
                    newUser.setName(request.getName());
                    newUser.setEmail(request.getEmail());
                    newUser.setPassword(passwordEncoder.encode(request.getPassword()));
                    newUser.setRole(Role.ROLE_STAFF);
                    return userRepository.save(newUser);
                });

        // 3. Check if this staff is already assigned to THIS specific event
        // (Prevents duplicate assignment rows)
        boolean alreadyAssigned = staffRepository.existsByUserAndEvent(staffUser, event);

        if (!alreadyAssigned) {
            Staff staff = new Staff();
            staff.setUser(staffUser);
            staff.setEvent(event);
            staffRepository.save(staff);
        }
    }
}