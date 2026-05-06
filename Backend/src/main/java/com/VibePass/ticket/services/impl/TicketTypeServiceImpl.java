package com.VibePass.ticket.services.impl;

import com.VibePass.ticket.domain.entities.Ticket;
import com.VibePass.ticket.domain.entities.TicketStatusEnum;
import com.VibePass.ticket.domain.entities.TicketType;
import com.VibePass.ticket.domain.entities.User;
import com.VibePass.ticket.exceptions.TicketTypeNotFoundException;
import com.VibePass.ticket.exceptions.TicketsSoldOutException;
import com.VibePass.ticket.exceptions.UserNotFoundException;
import com.VibePass.ticket.repositories.TicketRepository;
import com.VibePass.ticket.repositories.TicketTypeRepository;
import com.VibePass.ticket.repositories.UserRepository;
import com.VibePass.ticket.services.QrCodeService;
import com.VibePass.ticket.services.TicketTypeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketRepository ticketRepository;
    private final QrCodeService qrCodeService;

    @Override
    @Transactional
    public Ticket purchaseTicket(UUID userId, UUID ticketTypeId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(
                String.format("User with ID %s was not found", userId)
        ));

        TicketType ticketType = ticketTypeRepository.findByIdWithLock(ticketTypeId)
                .orElseThrow(() -> new TicketTypeNotFoundException(
                        String.format("Ticket type with ID %s was not found", ticketTypeId)
                ));

        int purchasedTickets = ticketRepository.countByTicketTypeId(ticketType.getId());
        Integer totalAvailable = ticketType.getTotalAvailable();

        if(purchasedTickets + 1 > totalAvailable) {
            throw new TicketsSoldOutException();
        }

        Ticket ticket = new Ticket();
        ticket.setStatus(TicketStatusEnum.PURCHASED);
        ticket.setTicketType(ticketType);
        ticket.setPurchaser(user);

        Ticket savedTicket = ticketRepository.save(ticket);
        qrCodeService.generateQrCode(savedTicket);

        return ticketRepository.save(savedTicket);
    }
}

