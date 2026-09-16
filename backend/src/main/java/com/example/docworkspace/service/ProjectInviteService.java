package com.example.docworkspace.service;

import com.example.docworkspace.dto.InviteResponse;
import com.example.docworkspace.dto.SendInviteRequest;
import com.example.docworkspace.entity.Project;
import com.example.docworkspace.entity.ProjectInvite;
import com.example.docworkspace.entity.User;
import com.example.docworkspace.enums.InviteStatus;
import com.example.docworkspace.repository.ProjectInviteRepository;
import com.example.docworkspace.repository.ProjectMemberRepository;
import com.example.docworkspace.repository.ProjectRepository;
import com.example.docworkspace.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class ProjectInviteService {

    
    @Autowired
    private ProjectInviteRepository inviteRepository;

    @Autowired
    private ProjectMemberRepository memberRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectAccessService accessService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public InviteResponse sendInvite(Long actorId, Long projectId, SendInviteRequest request) {
        accessService.requireAdmin(projectId, actorId);

        String email = request.getEmail().trim().toLowerCase();

        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Already a member?
        userRepository.findByEmail(email).ifPresent(u -> {
            if (memberRepository.existsByProjectIdAndUserId(projectId, u.getId())) {
                throw new IllegalArgumentException("User is already a member");
            }
        });

        // Duplicate pending invite?
        if (inviteRepository.existsByProjectIdAndEmailAndStatus(
                projectId, email, InviteStatus.PENDING)) {
            throw new IllegalArgumentException("A pending invite already exists for this email");
        }

        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new IllegalArgumentException("Actor not found"));

        ProjectInvite invite = new ProjectInvite();
        invite.setProject(project);
        invite.setEmail(email);
        invite.setToken(generateToken());
        invite.setRole(request.getRole());
        invite.setStatus(InviteStatus.PENDING);
        invite.setInvitedBy(actor);
        invite.setExpiresAt(OffsetDateTime.now().plusDays(7));

        ProjectInvite saved = inviteRepository.save(invite);
        return toInviteResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<InviteResponse> listProjectInvites(Long actorId, Long projectId) {
        accessService.requireAdmin(projectId, actorId);

        return inviteRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::toInviteResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InviteResponse> listMyPendingInvites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return inviteRepository.findByEmailAndStatusOrderByCreatedAtDesc(
                        user.getEmail().toLowerCase(), InviteStatus.PENDING)
                .stream()
                .filter(i -> i.getExpiresAt().isAfter(OffsetDateTime.now()))
                .map(this::toInviteResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public InviteResponse getByToken(String token) {
        ProjectInvite invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invite not found"));

        if (invite.getStatus() == InviteStatus.EXPIRED ||
                invite.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("Invite has expired");
        }

        return toInviteResponse(invite);
    }

    @Transactional
    public InviteResponse acceptInvite(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ProjectInvite invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invite not found"));

        if (invite.getStatus() != InviteStatus.PENDING) {
            throw new IllegalArgumentException("Invite is not pending");
        }

        if (invite.getExpiresAt().isBefore(OffsetDateTime.now())) {
            invite.setStatus(InviteStatus.EXPIRED);
            inviteRepository.save(invite);
            throw new IllegalArgumentException("Invite has expired");
        }

        // Email must match
        if (!invite.getEmail().equalsIgnoreCase(user.getEmail())) {
            throw new IllegalArgumentException("This invite is for a different email");
        }

        // Already a member?
        if (memberRepository.existsByProjectIdAndUserId(invite.getProject().getId(), userId)) {
            invite.setStatus(InviteStatus.ACCEPTED);
            inviteRepository.save(invite);
            throw new IllegalArgumentException("You are already a member");
        }

        // Add as member
        var member = new com.example.docworkspace.entity.ProjectMember();
        member.setProject(invite.getProject());
        member.setUser(user);
        member.setRole(invite.getRole());
        memberRepository.save(member);

        invite.setStatus(InviteStatus.ACCEPTED);
        inviteRepository.save(invite);

        return toInviteResponse(invite);
    }

    @Transactional
    public void declineInvite(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ProjectInvite invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invite not found"));

        if (invite.getStatus() != InviteStatus.PENDING) {
            throw new IllegalArgumentException("Invite is not pending");
        }

        if (!invite.getEmail().equalsIgnoreCase(user.getEmail())) {
            throw new IllegalArgumentException("This invite is for a different email");
        }

        // Mark expired (or delete). Your schema doesn't have DECLINED, so use EXPIRED.
        invite.setStatus(InviteStatus.EXPIRED);
        inviteRepository.save(invite);
    }

    @Transactional
    public void revokeInvite(Long actorId, Long projectId, Long inviteId) {
        accessService.requireAdmin(projectId, actorId);

        ProjectInvite invite = inviteRepository.findByIdAndProjectId(inviteId, projectId)
                .orElseThrow(() -> new IllegalArgumentException("Invite not found"));

        if (invite.getStatus() != InviteStatus.PENDING) {
            throw new IllegalArgumentException("Only pending invites can be revoked");
        }

        invite.setStatus(InviteStatus.EXPIRED);
        inviteRepository.save(invite);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private InviteResponse toInviteResponse(ProjectInvite invite) {
        return new InviteResponse(
                invite.getId(),
                invite.getProject().getId(),
                invite.getProject().getName(),
                invite.getEmail(),
                invite.getToken(),
                invite.getRole(),
                invite.getStatus(),
                invite.getInvitedBy().getId(),
                invite.getInvitedBy().getName(),
                invite.getExpiresAt(),
                invite.getCreatedAt()
        );
    }
}