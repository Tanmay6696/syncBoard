package com.example.docworkspace.service;

import com.example.docworkspace.dto.*;
import com.example.docworkspace.entity.User;
import com.example.docworkspace.repository.UserRepository;
import com.example.docworkspace.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setEmail(email);
        user.setName(request.getName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);

        return issueTokens(saved);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(String rawRefreshToken) {
        var refreshToken = refreshTokenService.verifyRefreshToken(rawRefreshToken);

        // Revoke old token (rotation)
        refreshTokenService.revokeToken(rawRefreshToken);

        // Issue new tokens for the same user
        return issueTokens(refreshToken.getUser());
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenService.revokeToken(rawRefreshToken);
    }

    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(
                accessToken,
                refreshToken,
                new UserResponse(user.getId(), user.getEmail(), user.getName())
        );
    }
}