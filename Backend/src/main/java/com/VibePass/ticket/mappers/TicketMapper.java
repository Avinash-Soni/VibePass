package com.VibePass.ticket.mappers;

import com.VibePass.ticket.domain.dtos.GetTicketResponseDto;
import com.VibePass.ticket.domain.dtos.ListTicketResponseDto;
import com.VibePass.ticket.domain.dtos.ListTicketTicketTypeResponseDto;
import com.VibePass.ticket.domain.entities.Ticket;
import com.VibePass.ticket.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketMapper {

    ListTicketTicketTypeResponseDto toListTicketTicketTypeResponseDto(TicketType ticketType);

    // ✅ FIX HERE
    @Mapping(target = "eventName", source = "ticketType.event.name")
    @Mapping(target = "eventVenue", source = "ticketType.event.venue")
    @Mapping(target = "eventStart", source = "ticketType.event.start")
    @Mapping(target = "eventEnd", source = "ticketType.event.end")
    @Mapping(target = "used",
            expression = "java(ticket.getValidations() != null && ticket.getValidations().stream().anyMatch(v -> v.getStatus().name().equals(\"VALID\")))")
    ListTicketResponseDto toListTicketResponseDto(Ticket ticket);

    @Mapping(target = "price", source = "ticket.ticketType.price")
    @Mapping(target = "description", source = "ticket.ticketType.description")
    @Mapping(target = "eventName", source = "ticket.ticketType.event.name")
    @Mapping(target = "eventVenue", source = "ticket.ticketType.event.venue")
    @Mapping(target = "eventStart", source = "ticket.ticketType.event.start")
    @Mapping(target = "eventEnd", source = "ticket.ticketType.event.end")
    @Mapping(target = "used",
            expression = "java(ticket.getValidations() != null && ticket.getValidations().stream().anyMatch(v -> v.getStatus().name().equals(\"VALID\")))")
    GetTicketResponseDto toGetTicketResponseDto(Ticket ticket);

}