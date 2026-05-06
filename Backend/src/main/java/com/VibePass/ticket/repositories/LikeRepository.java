package com.VibePass.ticket.repositories;

import com.VibePass.ticket.domain.entities.Like;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LikeRepository extends JpaRepository<Like, UUID> {

    boolean existsByUserIdAndEventId(UUID userId, UUID eventId);

    @Modifying
    @Transactional
    void deleteByUserIdAndEventId(UUID userId, UUID eventId);

    long countByEventId(UUID eventId);
}
