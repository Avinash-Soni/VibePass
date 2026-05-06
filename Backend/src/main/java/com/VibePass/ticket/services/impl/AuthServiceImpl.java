package com.VibePass.ticket.services.impl;

import com.VibePass.ticket.domain.dtos.LoginRequest;
import com.VibePass.ticket.domain.dtos.LoginResponse;
import com.VibePass.ticket.domain.dtos.SignupRequest;
import com.VibePass.ticket.domain.entities.User;
import com.VibePass.ticket.repositories.UserRepository;
import com.VibePass.ticket.security.JwtUtil;
import com.VibePass.ticket.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    // Removed the problematic line from here
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public User register(SignupRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        return userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // This already calls the repository correctly
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user);
        return new LoginResponse(token);
    }
}