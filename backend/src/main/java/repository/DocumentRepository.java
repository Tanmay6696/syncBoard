package com.example.docworkspace.repository;

import com.example.docworkspace.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Integer> {

    List<Document> findByUserUserId(Integer userId);
}