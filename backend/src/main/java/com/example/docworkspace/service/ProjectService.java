package com.example.docworkspace.service;

import com.example.docworkspace.dto.ProjectRequest;
import com.example.docworkspace.dto.ProjectResponse;
import com.example.docworkspace.entity.Project;
import com.example.docworkspace.entity.Workspace;
import com.example.docworkspace.repository.ProjectRepository;
import com.example.docworkspace.repository.WorkspaceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class ProjectService {
    @Autowired 
    private ProjectRepository projectRepository;
    @Autowired 
    private WorkspaceRepository workspaceRepository;

    

    @Transactional
    public ProjectResponse create(Long ownerId, ProjectRequest request) {
        if (request.getWorkspaceId() == null) {
            throw new IllegalArgumentException("workspaceId is required");
        }

        Workspace workspace = workspaceRepository
                .findByIdAndOwnerId(request.getWorkspaceId(), ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        Project project = new Project();
        project.setName(request.getName().trim());
        project.setDescription(request.getDescription());
        project.setWorkspace(workspace);

        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> listByWorkspace(Long ownerId, Long workspaceId) {
        // Verify the workspace belongs to this user
        workspaceRepository.findByIdAndOwnerId(workspaceId, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        return projectRepository
                .findByWorkspaceIdAndDeletedAtIsNullOrderByCreatedAtDesc(workspaceId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getById(Long ownerId, Long projectId) {
        Project project = findOwnedProject(ownerId, projectId);
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse update(Long ownerId, Long projectId, ProjectRequest request) {
        Project project = findOwnedProject(ownerId, projectId);

        project.setName(request.getName().trim());
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }

        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long ownerId, Long projectId) {
        Project project = findOwnedProject(ownerId, projectId);

        // Soft delete
        project.setDeletedAt(OffsetDateTime.now());
        projectRepository.save(project);
    }

    // ------------------- helpers -------------------

    private Project findOwnedProject(Long ownerId, Long projectId) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Make sure the project's workspace belongs to the current user
        if (!project.getWorkspace().getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("Project not found");
        }

        return project;
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getWorkspace().getId(),
                project.getWorkspace().getName(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}