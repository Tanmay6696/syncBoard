// package com.example.docworkspace.service;

// import com.example.docworkspace.entity.Document;
// import com.example.docworkspace.entity.User;
// import com.example.docworkspace.repository.DocumentRepository;
// import com.example.docworkspace.repository.UserRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service
// public class DocumentService {

//     private final DocumentRepository documentRepository;
//     private final UserRepository userRepository;

//     public DocumentService(
//             DocumentRepository documentRepository,
//             UserRepository userRepository) {

//         this.documentRepository = documentRepository;
//         this.userRepository = userRepository;
//     }

//     // GET DOCUMENTS OF ONE USER
//     public List<Document> getDocumentsByUser(Integer userId) {
//         return documentRepository.findByUserUserId(userId);
//     }

//     // CREATE DOCUMENT FOR USER
//     public Document createDocument(Document document, Integer userId) {

//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new RuntimeException("User not found"));

//         document.setUser(user);

//         return documentRepository.save(document);
//     }

//     public Document getDocumentById(Integer id) {
//         return documentRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Document not found"));
//     }

//     public List<Document> getAllDocuments() {
//         return documentRepository.findAll();
//     }

//     public Document updateDocument(Integer id, Document document) {

//         Document existing = getDocumentById(id);

//         existing.setTitle(document.getTitle());
//         existing.setContent(document.getContent());
//         existing.setXPosition(document.getXPosition());
//         existing.setYPosition(document.getYPosition());
//         existing.setFilesize(document.getFilesize());
//         existing.setClose(document.getClose());
//         existing.setTagOpen(document.getTagOpen());
//         existing.setTagTitle(document.getTagTitle());
//         existing.setTagColor(document.getTagColor());

//         return documentRepository.save(existing);
//     }

//     public void deleteDocument(Integer id) {
//         documentRepository.deleteById(id);
//     }

//     public Document updatePosition(
//             Integer id,
//             Integer xPosition,
//             Integer yPosition) {

//         Document document = getDocumentById(id);

//         document.setXPosition(xPosition);
//         document.setYPosition(yPosition);

//         return documentRepository.save(document);
//     }
// }