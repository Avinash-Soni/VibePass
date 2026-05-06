package com.VibePass.ticket.controllers;

import com.VibePass.ticket.domain.CreateEventRequest;
import com.VibePass.ticket.domain.UpdateEventRequest;
import com.VibePass.ticket.domain.dtos.*;
import com.VibePass.ticket.domain.entities.Event;
import com.VibePass.ticket.domain.entities.User; // 👈 Import your User entity
import com.VibePass.ticket.mappers.EventMapper;
import com.VibePass.ticket.services.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {
    private final EventMapper eventMapper;
    private final EventService eventService;

    @PostMapping
    public ResponseEntity<CreateEventResponseDto> createEvent(
            @AuthenticationPrincipal User user, // 👈 Changed from Jwt to User
            @Valid @RequestBody CreateEventRequestDto createEventRequestDto) {

        CreateEventRequest createEventRequest = eventMapper.fromDto(createEventRequestDto);
        UUID userId = user.getId(); // 👈 Extract ID directly from the Principal

        Event createdEvent = eventService.createEvent(userId, createEventRequest);
        CreateEventResponseDto createEventResponseDto = eventMapper.toDto(createdEvent);
        return new ResponseEntity<>(createEventResponseDto, HttpStatus.CREATED);
    }

    @PutMapping(path = "/{eventId}")
    public ResponseEntity<UpdateEventResponseDto> updateEvent(
            @AuthenticationPrincipal User user, // 👈 Changed
            @PathVariable UUID eventId,
            @Valid @RequestBody UpdateEventRequestDto updateEventRequestDto) {

        UpdateEventRequest updateEventRequest = eventMapper.fromDto(updateEventRequestDto);
        UUID userId = user.getId();

        Event updatedEvent = eventService.updateEventForOrganizer(userId, eventId, updateEventRequest);
        return ResponseEntity.ok(eventMapper.toUpdateEventResponseDto(updatedEvent));
    }

    @GetMapping
    public ResponseEntity<Page<ListEventResponseDto>> listEvents(
            @AuthenticationPrincipal User user, // 👈 Changed
            Pageable pageable
    ) {
        UUID userId = user.getId();
        Page<Event> events = eventService.listEventsForOrganizer(userId, pageable);
        return ResponseEntity.ok(events.map(eventMapper::toListEventResponseDto));
    }

    @GetMapping(path = "/{eventId}")
    public ResponseEntity<GetEventDetailsResponseDto> getEvent(
            @AuthenticationPrincipal User user, // 👈 Changed
            @PathVariable UUID eventId
    ) {
        UUID userId = user.getId();
        return eventService.getEventForOrganizer(userId, eventId)
                .map(eventMapper::toGetEventDetailsResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping(path = "/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @AuthenticationPrincipal User user, // 👈 Changed
            @PathVariable UUID eventId
    ) {
        UUID userId = user.getId();
        eventService.deleteEventForOrganizer(userId, eventId);
        return ResponseEntity.noContent().build();
    }
}