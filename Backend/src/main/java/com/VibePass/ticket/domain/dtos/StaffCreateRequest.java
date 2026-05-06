package com.VibePass.ticket.domain.dtos;

import lombok.Data;

@Data
public class StaffCreateRequest {
    private String name;
    private String email;
    private String password;
}
