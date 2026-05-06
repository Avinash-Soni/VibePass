package com.VibePass.ticket.services.impl;

import com.VibePass.ticket.domain.entities.*;
import com.VibePass.ticket.exceptions.*; // Ensure you have AccessDeniedException or similar
import com.VibePass.ticket.repositories.*;
import com.VibePass.ticket.services.TicketValidationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationServiceImpl implements TicketValidationService {

    private final QrCodeRepository qrCodeRepository;
    private final TicketValidationRepository ticketValidationRepository;
    private final TicketRepository ticketRepository;
    private final StaffRepository staffRepository; // 👈 Added dependency

    @Override
    public TicketValidation validateTicketByQrCode(User currentUser, String qrCodeValue) {
        QrCode qrCode = qrCodeRepository.findByValueAndStatus(qrCodeValue, QrCodeStatusEnum.Active)
                .orElseThrow(() -> new QrCodeNotFoundException("QR Code not found"));

        Ticket ticket = qrCode.getTicket();

        // 🔒 Perform Security Check
        checkStaffAuthorization(currentUser, ticket);

        return validateTicket(ticket, TicketValidationMethod.QR_SCAN);
    }

    @Override
    public TicketValidation validateTicketManually(User currentUser, UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(TicketNotFoundException::new);

        // 🔒 Perform Security Check
        checkStaffAuthorization(currentUser, ticket);

        return validateTicket(ticket, TicketValidationMethod.MANUAL);
    }

    /**
     * 🛡️ Security Check: Ensures the Staff is assigned to the event this ticket belongs to.
     */
    private void checkStaffAuthorization(User currentUser, Ticket ticket) {
        if (currentUser.getRole() == Role.ROLE_ORGANIZER) return;

        UUID ticketEventId = ticket.getTicketType().getEvent().getId();

        // Check the many-to-many relationship table
        boolean isAuthorized = staffRepository.existsByUserAndEventId(currentUser, ticketEventId);

        if (!isAuthorized) {
            throw new AccessDeniedException("Unauthorized: You are not assigned to this event.");
        }
    }

    private TicketValidation validateTicket(Ticket ticket, TicketValidationMethod method) {
        TicketValidation ticketValidation = new TicketValidation();
        ticketValidation.setTicket(ticket);
        ticketValidation.setValidationMethod(method);

        // Logic to prevent double-entry
        TicketValidationStatusEnum status = ticket.getValidations().stream()
                .anyMatch(v -> TicketValidationStatusEnum.VALID.equals(v.getStatus()))
                ? TicketValidationStatusEnum.INVALID
                : TicketValidationStatusEnum.VALID;

        ticketValidation.setStatus(status);
        return ticketValidationRepository.save(ticketValidation);
    }
}