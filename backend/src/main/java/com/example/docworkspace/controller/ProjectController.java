package com.example.docworkspace.controller;

import com.example.docworkspace.dto.ProjectRequest;
import com.example.docworkspace.dto.ProjectResponse;
import com.example.docworkspace.security.CurrentUser;
import com.example.docworkspace.service.ProjectService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    // CREATE
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ProjectRequest request) {
        try {
            Long userId = CurrentUser.getId();
            ProjectResponse response = projectService.create(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET one
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Long userId = CurrentUser.getId();
            return ResponseEntity.ok(projectService.getById(userId, id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // LIST by workspace
    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<?> listByWorkspace(@PathVariable Long workspaceId) {
        try {
            Long userId = CurrentUser.getId();
            List<ProjectResponse> projects =
                    projectService.listByWorkspace(userId, workspaceId);
            return ResponseEntity.ok(projects);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @Valid @RequestBody ProjectRequest request) {
        try {
            Long userId = CurrentUser.getId();
            return ResponseEntity.ok(projectService.update(userId, id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE (soft)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Long userId = CurrentUser.getId();
            projectService.delete(userId, id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}