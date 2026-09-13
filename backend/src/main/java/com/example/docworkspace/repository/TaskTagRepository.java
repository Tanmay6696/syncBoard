package com.example.docworkspace.repository;

import com.example.docworkspace.entity.TaskTag;
import com.example.docworkspace.entity.TaskTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskTagRepository extends JpaRepository<TaskTag, TaskTagId> {
    List<TaskTag> findByTaskId(Long taskId);
    List<TaskTag> findByTagId(Long tagId);
}