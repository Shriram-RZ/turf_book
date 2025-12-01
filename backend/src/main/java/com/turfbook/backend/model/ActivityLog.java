package com.turfbook.backend.model;

import com.turfbook.backend.model.enums.ActivityType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * ActivityLog entity
 * Stores activity feed items for users
 */
@Data
@Entity
@Table(name = "activity_logs", indexes = {
        @Index(name = "idx_activity_logs_user_created", columnList = "user_id, created_at DESC")
})
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ActivityType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "related_user_id")
    private Long relatedUserId; // Friend/teammate involved

    @Column(name = "related_user_name", length = 100)
    private String relatedUserName;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
