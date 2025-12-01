package com.turfbook.backend.repository;

import com.turfbook.backend.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    @Query("SELECT t FROM Team t JOIN t.teamMembers m WHERE m.userId = :userId")
    List<Team> findByMembersId(@Param("userId") Long userId);

    List<Team> findByCaptainId(Long captainId);
}
