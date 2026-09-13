package com.example.docworkspace.repository;

import com.example.docworkspace.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // List projects in a workspace that haven't been soft-deleted
    List<Project> findByWorkspaceIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long workspaceId);

    // Fetch a single non-deleted project
    Optional<Project> findByIdAndDeletedAtIsNull(Long id);

    // Find a project only if it belongs to a specific workspace
    Optional<Project> findByIdAndWorkspaceIdAndDeletedAtIsNull(Long id, Long workspaceId);

    // Check existence within a workspace
    boolean existsByIdAndWorkspaceIdAndDeletedAtIsNull(Long id, Long workspaceId);
}