package com.example.docworkspace.service;

import com.example.docworkspace.dto.WorkspaceRequest;
import com.example.docworkspace.dto.WorkspaceResponse;
import com.example.docworkspace.entity.User;
import com.example.docworkspace.entity.Workspace;
import com.example.docworkspace.repository.UserRepository;
import com.example.docworkspace.repository.WorkspaceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkspaceService {
    @Autowired 
    private  WorkspaceRepository workspaceRepository;
    @Autowired 
    private  UserRepository userRepository;

    

    @Transactional
    public WorkspaceResponse create(Long ownerId, WorkspaceRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Workspace workspace = new Workspace();
        workspace.setName(request.getName().trim());
        workspace.setOwner(owner);

        Workspace saved = workspaceRepository.save(workspace);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponse> listForOwner(Long ownerId) {
        return workspaceRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public WorkspaceResponse getById(Long ownerId, Long workspaceId) {
        Workspace ws = workspaceRepository.findByIdAndOwnerId(workspaceId, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));
        return toResponse(ws);
    }

    @Transactional
    public WorkspaceResponse update(Long ownerId, Long workspaceId, WorkspaceRequest request) {
        Workspace ws = workspaceRepository.findByIdAndOwnerId(workspaceId, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        ws.setName(request.getName().trim());

        Workspace saved = workspaceRepository.save(ws);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long ownerId, Long workspaceId) {
        Workspace ws = workspaceRepository.findByIdAndOwnerId(workspaceId, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        workspaceRepository.delete(ws);
    }

    private WorkspaceResponse toResponse(Workspace ws) {
        return new WorkspaceResponse(
                ws.getId(),
                ws.getName(),
                ws.getOwner().getId(),
                ws.getOwner().getName(),
                ws.getCreatedAt(),
                ws.getUpdatedAt()
        );
    }
}