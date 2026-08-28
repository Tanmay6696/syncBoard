package com.example.docworkspace.controller;

import com.example.docworkspace.entity.Document;
import com.example.docworkspace.service.DocumentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    // GET ONLY THIS USER'S CARDS
    @GetMapping("/user/{userId}")
    public List<Document> getUserDocuments(
            @PathVariable Integer userId) {

        return documentService.getDocumentsByUser(userId);
    }

    // CREATE CARD FOR USER
    @PostMapping("/user/{userId}")
    public Document createDocument(
            @PathVariable Integer userId,
            @RequestBody Document document) {

        return documentService.createDocument(document, userId);
    }

    @GetMapping("/{id}")
    public Document getDocument(@PathVariable Integer id) {
        return documentService.getDocumentById(id);
    }

    @PutMapping("/{id}")
    public Document updateDocument(
            @PathVariable Integer id,
            @RequestBody Document document) {

        return documentService.updateDocument(id, document);
    }

    @DeleteMapping("/{id}")
    public void deleteDocument(@PathVariable Integer id) {
        documentService.deleteDocument(id);
    }

    @PutMapping("/{id}/position")
    public Document updatePosition(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> position) {

        return documentService.updatePosition(
                id,
                position.get("xPosition"),
                position.get("yPosition")
        );
    }
}