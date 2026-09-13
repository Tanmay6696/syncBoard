package com.example.docworkspace.service;

import com.example.docworkspace.dto.AddMemberRequest;
import com.example.docworkspace.dto.ChangeRoleRequest;
import com.example.docworkspace.dto.MemberResponse;
import com.example.docworkspace.entity.Project;
import com.example.docworkspace.entity.ProjectMember;
import com.example.docworkspace.entity.User;
import com.example.docworkspace.enums.Role;
import com.example.docworkspace.repository.ProjectMemberRepository;
import com.example.docworkspace.repository.ProjectRepository;
import com.example.docworkspace.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectMemberService {
    @Autowired
    private ProjectMemberRepository memberRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectAccessService accessService;

    public Role getRole(Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        if (project.getWorkspace().getOwner().getId().equals(userId)) {
            return Role.ADMIN;
        }

        return memberRepository.findByProjectIdAndUserId(projectId, userId)
                .map(ProjectMember::getRole)
                .orElseThrow(() -> new IllegalArgumentException("Not a project member"));
    }

    public void requireViewer(Long projectId, Long userId) {
        getRole(projectId, userId);
    }

    public void requireMember(Long projectId, Long userId) {
        Role role = getRole(projectId, userId);
        if (role == Role.VIEWER) {
            throw new IllegalArgumentException("Member or Admin role required");
        }
    }

    public void requireAdmin(Long projectId, Long userId) {
        Role role = getRole(projectId, userId);
        if (role != Role.ADMIN) {
            throw new IllegalArgumentException("Admin role required");
        }
    }

    

    @Transactional
    public MemberResponse addMember(Long actorId, Long projectId, AddMemberRequest request) {
        accessService.requireAdmin(projectId, actorId);

        String email = request.getEmail().trim().toLowerCase();

        User targetUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found. Ask them to register first."));

        if (memberRepository.existsByProjectIdAndUserId(projectId, targetUser.getId())) {
            throw new IllegalArgumentException("User is already a member of this project");
        }

        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        ProjectMember member = new ProjectMember();
        member.setProject(project);
        member.setUser(targetUser);
        member.setRole(request.getRole());

        ProjectMember saved = memberRepository.save(member);
        return toMemberResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> listMembers(Long actorId, Long projectId) {
        accessService.requireViewer(projectId, actorId);

        return memberRepository.findByProjectId(projectId)
                .stream()
                .map(this::toMemberResponse)
                .toList();
    }

    @Transactional
    public MemberResponse changeRole(Long actorId, Long projectId, Long userId, ChangeRoleRequest request) {
        accessService.requireAdmin(projectId, actorId);

        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        // Prevent removing the last ADMIN
        if (member.getRole() == Role.ADMIN && request.getRole() != Role.ADMIN) {
            long adminCount = memberRepository.countByProjectIdAndRole(projectId, Role.ADMIN);
            if (adminCount <= 1) {
                throw new IllegalArgumentException("Cannot demote the last ADMIN");
            }
        }

        member.setRole(request.getRole());
        ProjectMember saved = memberRepository.save(member);
        return toMemberResponse(saved);
    }

    @Transactional
    public void removeMember(Long actorId, Long projectId, Long userId) {
        accessService.requireAdmin(projectId, actorId);

        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        // Prevent removing the last ADMIN
        if (member.getRole() == Role.ADMIN) {
            long adminCount = memberRepository.countByProjectIdAndRole(projectId, Role.ADMIN);
            if (adminCount <= 1) {
                throw new IllegalArgumentException("Cannot remove the last ADMIN");
            }
        }

        memberRepository.delete(member);
    }

    @Transactional
    public void leaveProject(Long userId, Long projectId) {
        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this project"));

        if (member.getRole() == Role.ADMIN) {
            long adminCount = memberRepository.countByProjectIdAndRole(projectId, Role.ADMIN);
            if (adminCount <= 1) {
                throw new IllegalArgumentException("You are the last ADMIN. Transfer ownership first.");
            }
        }

        memberRepository.delete(member);
    }

    private MemberResponse toMemberResponse(ProjectMember member) {
        return new MemberResponse(
                member.getId(),
                member.getUser().getId(),
                member.getUser().getName(),
                member.getUser().getEmail(),
                member.getRole(),
                member.getAddedAt());
    }
}