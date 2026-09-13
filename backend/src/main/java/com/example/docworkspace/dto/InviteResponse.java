package com.example.docworkspace.dto;

import com.example.docworkspace.enums.InviteStatus;
import com.example.docworkspace.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
public class InviteResponse {
    private Long id;
    private Long projectId;
    private String projectName;
    private String email;
    private String token;
    private Role role;
    private InviteStatus status;
    private Long invitedById;
    private String invitedByName;
    private OffsetDateTime expiresAt;
    private OffsetDateTime createdAt;
}