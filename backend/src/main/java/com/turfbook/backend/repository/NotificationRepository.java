package com.turfbook.backend.repository;

import com.turfbook.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Notification entity
 * Provides CRUD operations and custom queries for notifications
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Find all notifications for a user, ordered by creation date (newest first)
     * 
     * @param userId User ID
     * @return List of notifications
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Count unread notifications for a user
     * 
     * @param userId User ID
     * @return Count of unread notifications
     */
    Long countByUserIdAndReadFalse(Long userId);

    /**
     * Find unread notifications for a user
     * 
     * @param userId User ID
     * @return List of unread notifications
     */
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(Long userId);

    /**
     * Find actionable notifications for a user
     * 
     * @param userId     User ID
     * @param actionable Whether notification is actionable
     * @return List of actionable notifications
     */
    List<Notification> findByUserIdAndActionableOrderByCreatedAtDesc(Long userId, Boolean actionable);
}
