package com.turfbook.backend.repository;

import com.turfbook.backend.model.ActivityLog;
import com.turfbook.backend.model.enums.ActivityType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for ActivityLog entity
 * Manages activity feed for users
 */
@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    /**
     * Find activity logs for a user (paginated)
     * 
     * @param userId   User ID
     * @param pageable Pagination parameters
     * @return List of activity logs
     */
    List<ActivityLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * Find activity logs related to a user (friend activity)
     * 
     * @param relatedUserId Related user ID
     * @param pageable      Pagination parameters
     * @return List of activity logs
     */
    List<ActivityLog> findByRelatedUserIdOrderByCreatedAtDesc(Long relatedUserId, Pageable pageable);

    /**
     * Find activity logs by type for a user
     * 
     * @param userId   User ID
     * @param type     Activity type
     * @param pageable Pagination parameters
     * @return List of activity logs
     */
    List<ActivityLog> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, ActivityType type, Pageable pageable);

    /**
     * Find recent activity logs for a user (last N days)
     * 
     * @param userId   User ID
     * @param since    Date threshold
     * @param pageable Pagination parameters
     * @return List of recent activity logs
     */
    List<ActivityLog> findByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(Long userId, LocalDateTime since,
            Pageable pageable);
}
