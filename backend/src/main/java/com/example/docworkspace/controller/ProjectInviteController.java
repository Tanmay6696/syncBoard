package com.example.docworkspace.controller;

import com.example.docworkspace.dto.InviteResponse;
import com.example.docworkspace.dto.SendInviteRequest;
import com.example.docworkspace.security.CurrentUser;
import com.example.docworkspace.service.ProjectInviteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProjectInviteController {

    private final ProjectInviteService inviteService;

    public ProjectInviteController(ProjectInviteService inviteService) {
        this.inviteService = inviteService;
    }

    // -------------------------
    // Project-scoped endpoints
    // -------------------------

    @PostMapping("/projects/{projectId}/invites")
    public ResponseEntity<?> sendInvite(@PathVariable Long projectId,
                                        @Valid @RequestBody SendInviteRequest request) {
        try {
            Long userId = CurrentUser.getId();
            InviteResponse response = inviteService.sendInvite(userId, projectId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/projects/{projectId}/invites")
    public ResponseEntity<?> listForProject(@PathVariable Long projectId) {
        try {
            Long userId = CurrentUser.getId();
            List<InviteResponse> invites = inviteService.listProjectInvites(userId, projectId);
            return ResponseEntity.ok(invites);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/projects/{projectId}/invites/{inviteId}")
    public ResponseEntity<?> revoke(@PathVariable Long projectId,
                                    @PathVariable Long inviteId) {
        try {
            Long userId = CurrentUser.getId();
            inviteService.revokeInvite(userId, projectId, inviteId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // -------------------------
    // User-facing endpoints
    // -------------------------

    @GetMapping("/invites/me")
    public ResponseEntity<?> listMyInvites() {
        Long userId = CurrentUser.getId();
        return ResponseEntity.ok(inviteService.listMyPendingInvites(userId));
    }

    @GetMapping("/invites/token/{token}")
    public ResponseEntity<?> getByToken(@PathVariable String token) {
        try {
            return ResponseEntity.ok(inviteService.getByToken(token));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/invites/token/{token}/accept")
    public ResponseEntity<?> accept(@PathVariable String token) {
        try {
            Long userId = CurrentUser.getId();
            return ResponseEntity.ok(inviteService.acceptInvite(userId, token));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/invites/token/{token}/decline")
    public ResponseEntity<?> decline(@PathVariable String token) {
        try {
            Long userId = CurrentUser.getId();
            inviteService.declineInvite(userId, token);
            return ResponseEntity.ok(Map.of("message", "Invite declined"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}