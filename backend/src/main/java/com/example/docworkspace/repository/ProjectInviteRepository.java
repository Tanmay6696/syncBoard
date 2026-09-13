package com.example.docworkspace.repository;

import com.example.docworkspace.entity.ProjectInvite;
import com.example.docworkspace.enums.InviteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectInviteRepository extends JpaRepository<ProjectInvite, Long> {

    Optional<ProjectInvite> findByToken(String token);

    List<ProjectInvite> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<ProjectInvite> findByEmailAndStatusOrderByCreatedAtDesc(String email, InviteStatus status);

    boolean existsByProjectIdAndEmailAndStatus(Long projectId, String email, InviteStatus status);

    Optional<ProjectInvite> findByIdAndProjectId(Long id, Long projectId);
}