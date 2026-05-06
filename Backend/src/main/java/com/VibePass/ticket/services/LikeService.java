package com.VibePass.ticket.services;

import java.util.UUID;

public interface LikeService {
    void toggleLike(UUID userId, UUID eventId);
    long getLikeCount(UUID eventId);
    boolean isLiked(UUID userId, UUID eventId);
}
