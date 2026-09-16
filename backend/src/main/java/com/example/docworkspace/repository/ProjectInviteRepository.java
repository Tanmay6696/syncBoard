package com.example.docworkspace.repository;

import com.example.docworkspace.entity.ProjectInvite;
import com.example.docworkspace.enums.InviteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectInviteRepository extends JpaRepository<ProjectInvite, Long> {



    List<ProjectInvite> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<ProjectInvite> findByEmailAndStatusOrderByCreatedAtDesc(
            String email, InviteStatus status);


    Optional<ProjectInvite> findByToken(String token);

    boolean existsByProjectIdAndEmailAndStatus(
            Long projectId, String email, InviteStatus status);

    Optional<ProjectInvite> findByIdAndProjectId(Long id, Long projectId);

    // used by listProjectInvites — fetch-join to avoid N+1
    @Query("""
        SELECT i FROM ProjectInvite i
        JOIN FETCH i.invitedBy
        JOIN FETCH i.project
        WHERE i.project.id = :projectId
        ORDER BY i.createdAt DESC
    """)
    List<ProjectInvite> findAllByProjectIdWithInviter(@Param("projectId") Long projectId);

    // used by listMyPendingInvites — expiry filter pushed into SQL
    @Query("""
        SELECT i FROM ProjectInvite i
        JOIN FETCH i.project p
        JOIN FETCH p.workspace
        JOIN FETCH i.invitedBy
        WHERE LOWER(i.email) = LOWER(:email)
          AND i.status = :status
          AND i.expiresAt > :now
        ORDER BY i.createdAt DESC
    """)
    List<ProjectInvite> findPendingValidForEmail(
            @Param("email") String email,
            @Param("status") InviteStatus status,
            @Param("now") OffsetDateTime now);

    // used by getByToken / acceptInvite — fetch-join everything
    @Query("""
        SELECT i FROM ProjectInvite i
        JOIN FETCH i.project p
        JOIN FETCH p.workspace
        JOIN FETCH i.invitedBy
        WHERE i.token = :token
    """)
    Optional<ProjectInvite> findByTokenWithDetails(@Param("token") String token);
}