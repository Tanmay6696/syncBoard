package com.example.docworkspace.repository;

import com.example.docworkspace.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByProjectId(Long projectId);
    Optional<Tag> findByProjectIdAndName(Long projectId, String name);
}