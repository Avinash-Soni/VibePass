package com.VibePass.ticket.controllers;

import com.VibePass.ticket.domain.entities.User;
import com.VibePass.ticket.services.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/{eventId}")
    public ResponseEntity<?> toggleLike(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        likeService.toggleLike(user.getId(), eventId);
        return ResponseEntity.ok("Toggled");
    }

    @GetMapping("/{eventId}/status")
    public ResponseEntity<Boolean> isLiked(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.ok(false);
        }

        return ResponseEntity.ok(
                likeService.isLiked(user.getId(), eventId)
        );
    }

    @GetMapping("/{eventId}/count")
    public ResponseEntity<Long> getCount(@PathVariable UUID eventId) {
        return ResponseEntity.ok(likeService.getLikeCount(eventId));
    }
}