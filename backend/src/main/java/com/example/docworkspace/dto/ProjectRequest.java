package com.example.docworkspace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(max = 150, message = "Name must be at most 150 characters")
    private String name;

    @Size(max = 5000, message = "Description is too long")
    private String description;

    // Required only for create
    private Long workspaceId;
}