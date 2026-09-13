package com.example.docworkspace.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tags",
       uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "name"}))
@Data
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 7)
    private String color;
}