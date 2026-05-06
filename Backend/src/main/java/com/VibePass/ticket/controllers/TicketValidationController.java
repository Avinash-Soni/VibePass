package com.VibePass.ticket.controllers;

import com.VibePass.ticket.domain.dtos.TicketValidationRequestDto;
import com.VibePass.ticket.domain.dtos.TicketValidationResponseDto;
import com.VibePass.ticket.domain.entities.TicketValidation;
import com.VibePass.ticket.domain.entities.TicketValidationMethod;
import com.VibePass.ticket.domain.entities.User; // ✅ Import User
import com.VibePass.ticket.mappers.TicketValidationMapper;
import com.VibePass.ticket.services.TicketValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // ✅ Import this
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
// ... other imports

@RestController
@RequestMapping(path = "/api/v1/ticket-validations")
@RequiredArgsConstructor
public class TicketValidationController {

    private final TicketValidationService ticketValidationService;
    private final TicketValidationMapper ticketValidationMapper;

    @PostMapping
    public ResponseEntity<TicketValidationResponseDto> validateTicket(
            @AuthenticationPrincipal User user, // 👈 Spring Security injects the staff user here
            @RequestBody TicketValidationRequestDto request
    ){
        TicketValidation ticketValidation;

        if(TicketValidationMethod.MANUAL.equals(request.getMethod())) {
            // Pass the 'user' object here
            ticketValidation = ticketValidationService.validateTicketManually(user, request.getId());
        } else {
            // Pass the 'user' object here
            ticketValidation = ticketValidationService.validateTicketByQrCode(user, String.valueOf(request.getId()));
        }

        return ResponseEntity.ok(ticketValidationMapper.toTicketValidationResponseDto(ticketValidation));
    }
}