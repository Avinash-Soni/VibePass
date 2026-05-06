package com.VibePass.ticket.services;

import com.VibePass.ticket.domain.entities.TicketValidation;
import com.VibePass.ticket.domain.entities.User;
import java.util.UUID;

public interface TicketValidationService {
    // Keep ONLY these two:
    TicketValidation validateTicketByQrCode(User currentUser, String qrCodeValue);
    TicketValidation validateTicketManually(User currentUser, UUID ticketId);
}