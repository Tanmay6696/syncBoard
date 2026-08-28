package com.example.docworkspace.controller;

import com.example.docworkspace.entity.User;
import com.example.docworkspace.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        user.setEmail(user.getEmail().trim().toLowerCase());

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        User savedUser = userRepository.save(user);

        savedUser.setPassword(null);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        String email = loginUser.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        if (!user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        // DON'T remove userId
        user.setPassword(null);

        return ResponseEntity.ok(user);
    }
}