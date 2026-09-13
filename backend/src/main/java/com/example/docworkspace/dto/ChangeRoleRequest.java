package com.example.docworkspace.dto;

import com.example.docworkspace.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeRoleRequest {

    @NotNull(message = "Role is required")
    private Role role;
}