package com.VibePass.ticket.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class StaffResponseDto {
    private UUID id;
    private String name;
    private String email;
}
