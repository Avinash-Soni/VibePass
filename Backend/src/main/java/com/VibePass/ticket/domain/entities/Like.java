package com.VibePass.ticket.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "event_id"})
})

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    public Like(UUID userId, UUID eventId) {
        this.userId = userId;
        this.eventId = eventId;
    }
}
