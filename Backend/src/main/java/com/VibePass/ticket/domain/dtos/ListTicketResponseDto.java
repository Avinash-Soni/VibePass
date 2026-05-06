package com.VibePass.ticket.domain.dtos;

import com.VibePass.ticket.domain.entities.TicketStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListTicketResponseDto {
    private UUID id;
    private TicketStatusEnum status;
    private String eventName;
    private String eventVenue;
    private boolean used;
    private LocalDateTime eventStart;
    private LocalDateTime eventEnd;
    private ListTicketTicketTypeResponseDto ticketType;
}
