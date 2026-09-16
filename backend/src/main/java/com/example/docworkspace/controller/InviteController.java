package com.example.docworkspace.controller;

import com.example.docworkspace.dto.InviteResponse;
import com.example.docworkspace.dto.SendInviteRequest;
import com.example.docworkspace.security.CurrentUser;
import com.example.docworkspace.service.ProjectInviteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InviteController {

    private final ProjectInviteService inviteService;

    // ---------------------------------------------------------
    // Inbox — pending project invites for the logged-in user
    // ---------------------------------------------------------
    @GetMapping("/me/invites")
    public List<InviteResponse> myInvites(CurrentUser me) {
        return inviteService.listMyPendingInvites(me.getId());
    }

    // ---------------------------------------------------------
    // Invite a user to a project (by email)
    // ---------------------------------------------------------
    @PostMapping("/projects/{projectId}/invite")
    public ResponseEntity<InviteResponse> invite(
            CurrentUser me,
            @PathVariable Long projectId,
            @Valid @RequestBody SendInviteRequest request) {

        InviteResponse response = inviteService.sendInvite(me.getId(), projectId, request);
        return ResponseEntity.ok(response);
    }

    // ---------------------------------------------------------
    // List invites for a project (admin view)
    // ---------------------------------------------------------
    @GetMapping("/projects/{projectId}/invites")
    public List<InviteResponse> listProjectInvites(
            CurrentUser me,
            @PathVariable Long projectId) {

        return inviteService.listProjectInvites(me.getId(), projectId);
    }

    // ---------------------------------------------------------
    // Accept
    // ---------------------------------------------------------
    @PostMapping("/invites/{token}/accept")
    public ResponseEntity<InviteResponse> accept(
            CurrentUser me,
            @PathVariable String token) {

        return ResponseEntity.ok(inviteService.acceptInvite(me.getId(), token));
    }

    // ---------------------------------------------------------
    // Decline
    // ---------------------------------------------------------
    @PostMapping("/invites/{token}/decline")
    public ResponseEntity<Void> decline(
            CurrentUser me,
            @PathVariable String token) {

        inviteService.declineInvite(me.getId(), token);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------
    // Revoke (admin only)
    // ---------------------------------------------------------
    @DeleteMapping("/projects/{projectId}/invites/{inviteId}")
    public ResponseEntity<Void> revoke(
            CurrentUser me,
            @PathVariable Long projectId,
            @PathVariable Long inviteId) {

        inviteService.revokeInvite(me.getId(), projectId, inviteId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------
    // Public preview of an invite by token
    // ---------------------------------------------------------
    @GetMapping("/invites/{token}")
    public InviteResponse preview(@PathVariable String token) {
        return inviteService.getByToken(token);
    }
}