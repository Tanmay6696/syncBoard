package com.example.docworkspace.repository;

import com.example.docworkspace.entity.ProjectMember;
import com.example.docworkspace.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByProjectId(Long projectId);

    List<ProjectMember> findByUserId(Long userId);

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    long countByProjectIdAndRole(Long projectId, Role role);

    long countByProjectId(Long projectId);
}