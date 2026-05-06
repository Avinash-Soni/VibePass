package com.VibePass.ticket.services;

import com.VibePass.ticket.domain.entities.QrCode;
import com.VibePass.ticket.domain.entities.Ticket;

import java.util.UUID;

public interface QrCodeService {

    QrCode generateQrCode(Ticket ticket);

    byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}
