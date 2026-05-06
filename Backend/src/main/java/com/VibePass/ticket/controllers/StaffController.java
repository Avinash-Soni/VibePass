package com.VibePass.ticket.controllers;

import com.VibePass.ticket.domain.dtos.StaffCreateRequest;
import com.VibePass.ticket.services.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping("/events/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<?> addStaffToEvent(
            @PathVariable UUID eventId,
            @RequestBody StaffCreateRequest request) {

        // request should contain email, password, and name for the new staff user
        staffService.createAndAssignStaff(eventId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/events/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<?> getStaffByEvent(@PathVariable UUID eventId) {
        return ResponseEntity.ok(staffService.getStaffByEvent(eventId));
    }
}
