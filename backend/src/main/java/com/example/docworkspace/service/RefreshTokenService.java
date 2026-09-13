package com.example.docworkspace.service;

import com.example.docworkspace.entity.RefreshToken;
import com.example.docworkspace.entity.User;
import com.example.docworkspace.repository.RefreshTokenRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class RefreshTokenService {
    @Autowired 
    private RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private final SecureRandom secureRandom = new SecureRandom();

    

    /**
     * Creates a new refresh token for the user.
     * Returns the RAW token (to send to client). Only the HASH is stored in DB.
     */
    @Transactional
    public String createRefreshToken(User user) {
        // Generate 64 random bytes
        byte[] randomBytes = new byte[64];
        secureRandom.nextBytes(randomBytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        // Hash it for storage
        String tokenHash = hashToken(rawToken);

        // Persist
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(tokenHash);
        refreshToken.setExpiresAt(OffsetDateTime.now().plusSeconds(refreshTokenExpiration / 1000));
        refreshToken.setRevoked(false);

        refreshTokenRepository.save(refreshToken);

        // Return raw token to caller (client)
        return rawToken;
    }

    /**
     * Verifies the refresh token exists, is not revoked, and not expired.
     * Returns the RefreshToken entity if valid.
     */
    public RefreshToken verifyRefreshToken(String rawToken) {
        String tokenHash = hashToken(rawToken);

        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (refreshToken.getRevoked()) {
            throw new IllegalArgumentException("Refresh token has been revoked");
        }

        if (refreshToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("Refresh token has expired");
        }

        return refreshToken;
    }

    @Transactional
    public void revokeToken(String rawToken) {
        String tokenHash = hashToken(rawToken);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Transactional
    public void revokeAllForUser(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }

    /**
     * SHA-256 hash of the token. Never store raw tokens in DB.
     */
    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}