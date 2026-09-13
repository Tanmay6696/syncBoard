package com.example.docworkspace.dto;

import com.example.docworkspace.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
public class MemberResponse {
    private Long id;            // project_members.id
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private OffsetDateTime addedAt;
}