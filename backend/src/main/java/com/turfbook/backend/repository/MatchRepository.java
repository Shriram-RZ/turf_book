package com.turfbook.backend.repository;

import com.turfbook.backend.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatus(String status);

    List<Match> findByTeamA_IdOrTeamB_Id(Long teamAId, Long teamBId);
}
