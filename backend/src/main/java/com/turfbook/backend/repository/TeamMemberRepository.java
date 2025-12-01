package com.turfbook.backend.repository;

import com.turfbook.backend.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByTeamId(Long teamId);

    List<TeamMember> findByUserId(Long userId);

    java.util.Optional<TeamMember> findByTeamIdAndUserId(Long teamId, Long userId);
}
