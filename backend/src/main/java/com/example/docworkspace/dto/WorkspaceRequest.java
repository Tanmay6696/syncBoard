package com.example.docworkspace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WorkspaceRequest {

    @NotBlank(message = "Workspace name is required")
    @Size(max = 150, message = "Name must be at most 150 characters")
    private String name;
}