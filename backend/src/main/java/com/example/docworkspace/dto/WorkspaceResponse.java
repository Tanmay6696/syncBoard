package com.example.docworkspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
public class WorkspaceResponse {
    private Long id;
    private String name;
    private Long ownerId;
    private String ownerName;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}