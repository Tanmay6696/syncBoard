package com.example.docworkspace.repository;

import com.example.docworkspace.dto.InviteDto;
import com.example.docworkspace.entity.Workspace;
import com.example.docworkspace.entity.WorkspaceMember.Status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    // ---- existing (keep them, still useful) ----
    List<Workspace> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    Optional<Workspace> findByIdAndOwnerId(Long id, Long ownerId);

    boolean existsByIdAndOwnerId(Long id, Long ownerId);

    // ---- NEW: workspaces the user is a MEMBER of (covers owner too, if you
    //            always insert an OWNER row on workspace creation) ----
    @Query("""
        SELECT w FROM Workspace w
        JOIN WorkspaceMember m ON m.workspace = w
        WHERE m.user.id = :userId
        ORDER BY w.createdAt DESC
    """)
    List<Workspace> findAllByMemberUserId(@Param("userId") Long userId);

    // ---- NEW: single workspace only if the user is a member ----
    @Query("""
        SELECT w FROM Workspace w
        JOIN WorkspaceMember m ON m.workspace = w
        WHERE w.id = :workspaceId AND m.user.id = :userId
    """)
    Optional<Workspace> findByIdAndMemberUserId(
        @Param("workspaceId") Long workspaceId,
        @Param("userId") Long userId
    );

    // ---- NEW: authorization check ----
    @Query("""
        SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END
        FROM WorkspaceMember m
        WHERE m.workspace.id = :workspaceId AND m.user.id = :userId
    """)
    boolean existsByIdAndMemberUserId(
        @Param("workspaceId") Long workspaceId,
        @Param("userId") Long userId
    );

    static Collection<InviteDto> findByUserIdAndStatus(Long id, Status pending) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByUserIdAndStatus'");
    }
}