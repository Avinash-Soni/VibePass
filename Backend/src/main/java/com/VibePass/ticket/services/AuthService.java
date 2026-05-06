package com.VibePass.ticket.services;

import com.VibePass.ticket.domain.dtos.LoginRequest;
import com.VibePass.ticket.domain.dtos.LoginResponse;
import com.VibePass.ticket.domain.dtos.SignupRequest;
import com.VibePass.ticket.domain.entities.User;

public interface AuthService {
    User register(SignupRequest request);
    LoginResponse login(LoginRequest request);
}
