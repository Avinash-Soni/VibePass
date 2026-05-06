package com.VibePass.ticket.services;

import com.VibePass.ticket.domain.dtos.StaffCreateRequest;
import com.VibePass.ticket.domain.dtos.StaffResponseDto;

import java.util.List;
import java.util.UUID;

public interface StaffService {
    void createAndAssignStaff(UUID eventId, com.VibePass.ticket.domain.dtos.StaffCreateRequest request);
    List<StaffResponseDto> getStaffByEvent(UUID eventId);
}