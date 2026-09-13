package com.example.docworkspace.entity;

import com.example.docworkspace.enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;

@Entity
@Table(name = "project_members",
       uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "user_id"}))
@Data
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(name = "added_at", nullable = false, updatable = false)
    private OffsetDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        addedAt = OffsetDateTime.now();
    }
}