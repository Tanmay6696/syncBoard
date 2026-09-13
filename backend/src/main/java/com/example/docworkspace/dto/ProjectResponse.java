package com.example.docworkspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private Long workspaceId;
    private String workspaceName;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}