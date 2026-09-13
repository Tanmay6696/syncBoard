package com.example.docworkspace.controller;

import com.example.docworkspace.dto.WorkspaceRequest;
import com.example.docworkspace.dto.WorkspaceResponse;
import com.example.docworkspace.security.CurrentUser;
import com.example.docworkspace.service.WorkspaceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workspaces")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody WorkspaceRequest request) {
        try {
            System.out.println("Received request: " + request);
            Long userId = CurrentUser.getId();
            WorkspaceResponse response = workspaceService.create(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<WorkspaceResponse>> list() {
        Long userId = CurrentUser.getId();
        return ResponseEntity.ok(workspaceService.listForOwner(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Long userId = CurrentUser.getId();
            return ResponseEntity.ok(workspaceService.getById(userId, id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @Valid @RequestBody WorkspaceRequest request) {
        try {
            Long userId = CurrentUser.getId();
            return ResponseEntity.ok(workspaceService.update(userId, id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Long userId = CurrentUser.getId();
            workspaceService.delete(userId, id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}