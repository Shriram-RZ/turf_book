package com.turfbook.backend.repository;

import com.turfbook.backend.model.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByUserIdAndStatus(Long userId, com.turfbook.backend.model.enums.FriendStatus status);

    List<Friend> findByFriendIdAndStatus(Long friendId, com.turfbook.backend.model.enums.FriendStatus status);

    Optional<Friend> findByUserIdAndFriendId(Long userId, Long friendId);

    @Query("SELECT f FROM Friend f WHERE f.userId = :userId AND f.friendId = :friendId")
    Optional<Friend> findFriendship(@Param("userId") Long userId, @Param("friendId") Long friendId);

    boolean existsByUserIdAndFriendId(Long userId, Long friendId);
}
