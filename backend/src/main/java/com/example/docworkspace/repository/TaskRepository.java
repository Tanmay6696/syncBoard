package com.example.docworkspace.repository;

import com.example.docworkspace.entity.Task;
import com.example.docworkspace.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectIdAndDeletedAtIsNull(Long projectId);
    List<Task> findByProjectIdAndStatusAndDeletedAtIsNull(Long projectId, TaskStatus status);
    List<Task> findByAssigneeIdAndDeletedAtIsNull(Long assigneeId);
}