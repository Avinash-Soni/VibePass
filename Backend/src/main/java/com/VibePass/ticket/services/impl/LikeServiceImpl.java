package com.VibePass.ticket.services.impl;

import com.VibePass.ticket.domain.entities.Like;
import com.VibePass.ticket.repositories.LikeRepository;
import com.VibePass.ticket.services.LikeService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;

    @Override
    public void toggleLike(UUID userId, UUID eventId) {
        boolean exists = likeRepository.existsByUserIdAndEventId(userId, eventId);

        if (exists) {
            likeRepository.deleteByUserIdAndEventId(userId, eventId);
        } else {
            likeRepository.save(new Like(userId, eventId));
        }
    }

    @Override
    public long getLikeCount(UUID eventId) {
        return likeRepository.countByEventId(eventId);
    }

    @Override
    public boolean isLiked(UUID userId, UUID eventId) {
        return likeRepository.existsByUserIdAndEventId(userId, eventId);
    }
}
