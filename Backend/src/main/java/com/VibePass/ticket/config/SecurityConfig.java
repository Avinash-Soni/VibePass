package com.VibePass.ticket.config;

import com.VibePass.ticket.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // ✅ Enable CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ❌ Disable CSRF (for JWT)
                .csrf(csrf -> csrf.disable())

                // ✅ Stateless session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ✅ Authorization rules
                .authorizeHttpRequests(authorize ->
                        authorize
                                // 1. Public routes
                                .requestMatchers("/api/v1/auth/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/published-events/**").permitAll()

                                // 2. Ticket Purchase: Allow both Attendees and Organizers
                                // Using hasAnyRole allows an Organizer to buy a ticket for testing or personal use
                                .requestMatchers(HttpMethod.POST, "/api/v1/events/*/ticket-types/*/tickets")
                                .hasAnyRole("ATTENDEE", "ORGANIZER")

                                // 3. Ticket Viewing: Allow both to see their "My Tickets" section
                                .requestMatchers("/api/v1/tickets/**")
                                .hasAnyRole("ATTENDEE", "ORGANIZER")

                                // 4. Organizer Dashboard: Restricted to Organizers only
                                .requestMatchers("/api/v1/events/**").hasRole("ORGANIZER")
                                .requestMatchers("/api/v1/staff/**").hasRole("ORGANIZER")

                                // 5. Validations: Restricted to Staff or Organizers
                                .requestMatchers("/api/v1/ticket-validations/**")
                                .hasAnyRole("STAFF", "ORGANIZER")

                                .anyRequest().authenticated()
                )

                // ✅ JWT filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ✅ Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}