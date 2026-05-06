package com.VibePass.ticket.domain.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(
        name = "staff_assignments",
        uniqueConstraints = {
                // This ensures a staff member can't be added to the SAME event twice
                @UniqueConstraint(columnNames = {"user_id", "event_id"})
        }
)
@Getter
@Setter
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    // 👤 Changed from @OneToOne to @ManyToOne
    // One User can have "Many" Staff assignments (Event links)
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 🎉 Event assigned to staff
    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
}