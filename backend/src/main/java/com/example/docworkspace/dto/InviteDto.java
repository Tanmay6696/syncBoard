package com.example.docworkspace.dto;

import com.example.docworkspace.entity.WorkspaceMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InviteDto {

    /** workspace_members.id — used as the invite id in accept/reject URLs */
    private Long id;

    /** what kind of invite: WORKSPACE or PROJECT (useful when you add project invites) */
    private String type;

    private Long workspaceId;
    private String workspaceName;
    private String workspaceDescription;

    /** who sent the invite */
    private Long invitedById;
    private String invitedByUsername;

    /** role the user will get on accept (OWNER / ADMIN / MEMBER) */
    private String role;

    /** PENDING / ACTIVE / REJECTED */
    private String status;

    private Instant invitedAt;

    // ---- mapper ----
    public static InviteDto from(WorkspaceMember m) {
        return InviteDto.builder()
                .id(m.getId())
                .type("WORKSPACE")
                .workspaceId(m.getWorkspace().getId())
                .workspaceName(m.getWorkspace().getName())
                // .workspaceDescription(m.getWorkspace().getDescription())
                .invitedById(m.getInvitedBy() != null ? m.getInvitedBy().getId() : null)
                // .invitedByUsername(m.getInvitedBy() != null
                //         ? m.getInvitedBy().getUsername()
                //         : null)
                .role(m.getRole() != null ? m.getRole().name() : null)
                .status(m.getStatus() != null ? m.getStatus().name() : null)
                .invitedAt(m.getInvitedAt())
                .build();
    }
}