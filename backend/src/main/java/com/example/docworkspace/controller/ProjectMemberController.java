package com.example.docworkspace.controller;

import com.example.docworkspace.dto.AddMemberRequest;
import com.example.docworkspace.dto.ChangeRoleRequest;
import com.example.docworkspace.dto.MemberResponse;
import com.example.docworkspace.security.CurrentUser;
import com.example.docworkspace.service.ProjectMemberService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
public class ProjectMemberController {
    @Autowired 
    private ProjectMemberService memberService;
    

    @GetMapping
    public ResponseEntity<?> list(@PathVariable Long projectId) {
        try {
            Long userId = CurrentUser.getId();
            List<MemberResponse> members = memberService.listMembers(userId, projectId);
            return ResponseEntity.ok(members);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> add(@PathVariable Long projectId,
                                 @Valid @RequestBody AddMemberRequest request) {
        try {
            Long userId = CurrentUser.getId();
            MemberResponse response = memberService.addMember(userId, projectId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> changeRole(@PathVariable Long projectId,
                                        @PathVariable Long userId,
                                        @Valid @RequestBody ChangeRoleRequest request) {
        try {
            Long actorId = CurrentUser.getId();
            MemberResponse response = memberService.changeRole(actorId, projectId, userId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> remove(@PathVariable Long projectId,
                                    @PathVariable Long userId) {
        try {
            Long actorId = CurrentUser.getId();
            memberService.removeMember(actorId, projectId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> leave(@PathVariable Long projectId) {
        try {
            Long userId = CurrentUser.getId();
            memberService.leaveProject(userId, projectId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}