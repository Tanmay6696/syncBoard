package com.example.docworkspace.repository;

import com.example.docworkspace.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    List<Workspace> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    Optional<Workspace> findByIdAndOwnerId(Long id, Long ownerId);

    boolean existsByIdAndOwnerId(Long id, Long ownerId);
}