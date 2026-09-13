package com.example.docworkspace.service;

import com.example.docworkspace.entity.Project;
import com.example.docworkspace.entity.ProjectMember;
import com.example.docworkspace.enums.Role;
import com.example.docworkspace.repository.ProjectMemberRepository;
import com.example.docworkspace.repository.ProjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectAccessService {
    @Autowired 
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectMemberRepository memberRepository;

    

    /**
     * Returns the user's role in the project, or throws if not a member.
     */
    @Transactional(readOnly = true)
    public Role getRole(Long projectId, Long userId) {
        // First, verify the project exists and isn't soft-deleted
        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
                .orElseThrow(() -> new AccessDeniedException("Project not found"));

        // Workspace owner always has ADMIN on all their projects
        if (project.getWorkspace().getOwner().getId().equals(userId)) {
            return Role.ADMIN;
        }

        return memberRepository.findByProjectIdAndUserId(projectId, userId)
                .map(ProjectMember::getRole)
                .orElseThrow(() -> new AccessDeniedException("Not a project member"));
    }

    /**
     * Requires the user to be at least a VIEWER (any member).
     */
    public void requireViewer(Long projectId, Long userId) {
        getRole(projectId, userId); // throws if not a member
    }

    /**
     * Requires MEMBER or ADMIN (i.e., can write).
     */
    public void requireMember(Long projectId, Long userId) {
        Role role = getRole(projectId, userId);
        if (role == Role.VIEWER) {
            throw new AccessDeniedException("Member or Admin role required");
        }
    }

    /**
     * Requires ADMIN.
     */
    public void requireAdmin(Long projectId, Long userId) {
        Role role = getRole(projectId, userId);
        if (role != Role.ADMIN) {
            throw new AccessDeniedException("Admin role required");
        }
    }

    /**
     * Fast boolean check (no exception).
     */
    @Transactional(readOnly = true)
    public boolean hasAccess(Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId).orElse(null);
        if (project == null) return false;
        if (project.getWorkspace().getOwner().getId().equals(userId)) return true;
        return memberRepository.existsByProjectIdAndUserId(projectId, userId);
    }
}