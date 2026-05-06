package com.VibePass.ticket.controllers;

import com.VibePass.ticket.domain.entities.User; // ✅ Import your User entity
import com.VibePass.ticket.services.TicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

// Note: We removed the static import for parseUserId

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/events/{eventId}/ticket-types")
public class TicketTypeController {

    private final TicketTypeService ticketTypeService;

    @PostMapping(path = "/{ticketTypeId}/tickets")
    public ResponseEntity<Void> purchaseTicket(
            @AuthenticationPrincipal User user, // ✅ Changed from Jwt to User
            @PathVariable UUID ticketTypeId
    ) {
        // ✅ Access ID directly from the User object injected by JwtFilter
        ticketTypeService.purchaseTicket(user.getId(), ticketTypeId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}