package com.example.docworkspace.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "task_tags")
@IdClass(TaskTagId.class)
@Data
public class TaskTag {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    private Tag tag;
}