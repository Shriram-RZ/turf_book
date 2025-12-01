package com.turfbook.backend.service;

import com.turfbook.backend.dto.request.MatchRequest;
import com.turfbook.backend.dto.response.MatchResponse;
import com.turfbook.backend.dto.response.TeamResponse;
import com.turfbook.backend.dto.response.UserResponse;
import com.turfbook.backend.model.Match;
import com.turfbook.backend.model.Team;
import com.turfbook.backend.model.TeamMember;
import com.turfbook.backend.model.User;
import com.turfbook.backend.repository.MatchRepository;
import com.turfbook.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Transactional
    public MatchResponse findMatch(MatchRequest request) {
        Long teamId = request.getTeamId();
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // Simple matchmaking: Find any open match or create one
        List<Match> openMatches = matchRepository.findByStatus("LOOKING_FOR_OPPONENT");

        // Filter out matches where this team is already Team A
        Match match = openMatches.stream()
                .filter(m -> !m.getTeamA().getId().equals(teamId))
                .findFirst()
                .orElse(null);

        if (match != null) {
            match.setTeamB(team);
            match.setStatus("SCHEDULED");
            matchRepository.save(match);
            return mapToResponse(match);
        } else {
            Match newMatch = new Match();
            newMatch.setTeamA(team);
            newMatch.setStatus("LOOKING_FOR_OPPONENT");
            matchRepository.save(newMatch);
            return mapToResponse(newMatch);
        }
    }

    @Transactional
    public void completeMatch(Long matchId, Long winnerTeamId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setStatus("COMPLETED");
        match.setWinnerTeamId(winnerTeamId);
        matchRepository.save(match);

        // Update ELO ratings
        if (match.getTeamB() != null) {
            updateRatings(match.getTeamA(), match.getTeamB(), winnerTeamId);
        }
    }

    private void updateRatings(Team teamA, Team teamB, Long winnerId) {
        int kFactor = 32;
        double expectedA = 1.0 / (1.0 + Math.pow(10, (teamB.getSkillRating() - teamA.getSkillRating()) / 400.0));
        double expectedB = 1.0 / (1.0 + Math.pow(10, (teamA.getSkillRating() - teamB.getSkillRating()) / 400.0));

        double actualA = teamA.getId().equals(winnerId) ? 1.0 : 0.0;
        double actualB = teamB.getId().equals(winnerId) ? 1.0 : 0.0;

        teamA.setSkillRating(teamA.getSkillRating() + (int) (kFactor * (actualA - expectedA)));
        teamB.setSkillRating(teamB.getSkillRating() + (int) (kFactor * (actualB - expectedB)));

        // Update match stats
        teamA.setMatchesPlayed(teamA.getMatchesPlayed() + 1);
        teamB.setMatchesPlayed(teamB.getMatchesPlayed() + 1);

        if (teamA.getId().equals(winnerId)) {
            teamA.setMatchesWon(teamA.getMatchesWon() + 1);
        } else if (teamB.getId().equals(winnerId)) {
            teamB.setMatchesWon(teamB.getMatchesWon() + 1);
        }

        teamRepository.save(teamA);
        teamRepository.save(teamB);
    }

    private MatchResponse mapToResponse(Match match) {
        MatchResponse response = new MatchResponse();
        response.setId(match.getId());
        response.setTeamA(mapToTeamResponse(match.getTeamA()));
        if (match.getTeamB() != null) {
            response.setTeamB(mapToTeamResponse(match.getTeamB()));
        }
        response.setStatus(match.getStatus());
        response.setWinnerTeamId(match.getWinnerTeamId());
        // response.setCreatedAt(match.getCreatedAt()); // Assuming Match entity has
        // createdAt
        return response;
    }

    private TeamResponse mapToTeamResponse(Team team) {
        TeamResponse response = new TeamResponse();
        response.setId(team.getId());
        response.setName(team.getName());
        response.setLogoUrl(team.getLogoUrl());
        response.setCaptainId(team.getCaptainId());
        response.setSkillRating(team.getSkillRating());
        response.setMatchesPlayed(team.getMatchesPlayed());
        response.setMatchesWon(team.getMatchesWon());
        response.setMembers(team.getTeamMembers().stream()
                .map(teamMember -> mapToUserResponse(teamMember.getUser()))
                .collect(Collectors.toList()));
        return response;
    }

    public List<MatchResponse> getMatchHistory(Long userId) {
        // 1. Find user's team
        // This assumes a user belongs to only one team for now, or we pick the first
        // one
        // In a real app, we might want matches for all teams the user is in
        List<Team> userTeams = teamRepository.findByMembersId(userId);

        if (userTeams.isEmpty()) {
            return List.of();
        }

        // For simplicity, just get matches for the first team
        Long teamId = userTeams.get(0).getId();

        List<Match> matches = matchRepository.findByTeamA_IdOrTeamB_Id(teamId, teamId);

        return matches.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setAvatarUrl(user.getAvatarUrl());
        return response;
    }
}
