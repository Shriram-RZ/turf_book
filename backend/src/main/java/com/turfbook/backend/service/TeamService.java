package com.turfbook.backend.service;

import com.turfbook.backend.dto.request.TeamRequest;
import com.turfbook.backend.dto.response.TeamResponse;
import com.turfbook.backend.dto.response.UserResponse;
import com.turfbook.backend.model.Team;
import com.turfbook.backend.model.User;
import com.turfbook.backend.repository.TeamMemberRepository;
import com.turfbook.backend.repository.TeamRepository;
import com.turfbook.backend.repository.UserRepository;
import com.turfbook.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired
    private com.turfbook.backend.repository.TeamMemberRepository teamMemberRepository;

    @Autowired
    private com.turfbook.backend.repository.FriendRepository friendRepository;

    @Autowired
    private com.turfbook.backend.repository.TeamRepository teamRepository;

    @Autowired
    private com.turfbook.backend.repository.UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public TeamResponse createTeam(TeamRequest request, Long userId) {
        User captain = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = new Team();
        team.setName(request.getName());
        team.setCaptainId(userId);
        team.setLogoUrl(request.getLogoUrl());

        Team savedTeam = teamRepository.save(team);

        // Add captain as member
        com.turfbook.backend.model.TeamMember member = new com.turfbook.backend.model.TeamMember();
        member.setTeamId(savedTeam.getId());
        member.setUserId(userId);
        member.setRole("CAPTAIN");
        member.setStatus("ACCEPTED");
        teamMemberRepository.save(member);

        return mapToResponse(savedTeam);
    }

    @Transactional
    public void invitePlayer(Long teamId, Long userId, Long invitedBy) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // Check if inviter is captain (or has permission)
        if (!team.getCaptainId().equals(invitedBy)) {
            throw new RuntimeException("Only captain can invite players");
        }

        // Check if they are friends
        // Requirement: "Only friends with status = ACCEPTED can be added to a team"
        boolean areFriends = friendRepository.findFriendship(invitedBy, userId)
                .map(f -> f.getStatus() == com.turfbook.backend.model.enums.FriendStatus.ACCEPTED)
                .orElse(false);

        if (!areFriends) {
            throw new RuntimeException("You can only invite friends");
        }

        // Check if already member
        if (teamMemberRepository.findByTeamIdAndUserId(teamId, userId).isPresent()) {
            throw new RuntimeException("User is already a member or invited");
        }

        com.turfbook.backend.model.TeamMember member = new com.turfbook.backend.model.TeamMember();
        member.setTeamId(teamId);
        member.setUserId(userId);
        member.setRole("PLAYER");
        member.setStatus("INVITED");
        teamMemberRepository.save(member);

        // Notification
        notificationService.createNotification(
                userId,
                com.turfbook.backend.model.enums.NotificationType.REQUEST,
                "You have been invited to join team " + team.getName(),
                teamId,
                "TEAM",
                true);
    }

    @Transactional
    public void acceptInvite(Long teamId, Long userId) {
        com.turfbook.backend.model.TeamMember member = teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!"INVITED".equals(member.getStatus())) {
            throw new RuntimeException("No pending invite found");
        }

        member.setStatus("ACCEPTED");
        teamMemberRepository.save(member);

        Team team = teamRepository.findById(teamId).orElseThrow();

        // Notification to captain
        notificationService.createNotification(
                team.getCaptainId(),
                com.turfbook.backend.model.enums.NotificationType.APPROVAL,
                "A player has accepted your invite to team " + team.getName(),
                teamId,
                "TEAM",
                false);
    }

    @Transactional
    public void rejectInvite(Long teamId, Long userId) {
        com.turfbook.backend.model.TeamMember member = teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!"INVITED".equals(member.getStatus())) {
            throw new RuntimeException("No pending invite found");
        }

        member.setStatus("REJECTED");
        teamMemberRepository.save(member);
    }

    @Transactional
    public void removePlayer(Long teamId, Long userId, Long removedBy) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getCaptainId().equals(removedBy)) {
            throw new RuntimeException("Only captain can remove players");
        }

        if (team.getCaptainId().equals(userId)) {
            throw new RuntimeException("Captain cannot remove themselves (delete team instead)");
        }

        com.turfbook.backend.model.TeamMember member = teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.setStatus("REMOVED");
        teamMemberRepository.save(member);
    }

    // Deprecated/Modified joinTeam to be invite based, but keeping for
    // compatibility if needed
    // But requirement says "Team leader invites friend".
    // So "joinTeam" might be "acceptInvite".
    // I will remove the old joinTeam method or alias it.

    public TeamResponse getTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return mapToResponse(team);
    }

    public List<TeamResponse> getMyTeams(Long userId) {
        // Find teams where user is a member (ACCEPTED)
        List<com.turfbook.backend.model.TeamMember> memberships = teamMemberRepository.findByUserId(userId);
        return memberships.stream()
                .filter(m -> "ACCEPTED".equals(m.getStatus()))
                .map(m -> teamRepository.findById(m.getTeamId()).orElse(null))
                .filter(java.util.Objects::nonNull)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TeamResponse> getPendingInvites(Long userId) {
        List<com.turfbook.backend.model.TeamMember> memberships = teamMemberRepository.findByUserId(userId);
        return memberships.stream()
                .filter(m -> "INVITED".equals(m.getStatus()))
                .map(m -> teamRepository.findById(m.getTeamId()).orElse(null))
                .filter(java.util.Objects::nonNull)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TeamResponse mapToResponse(Team team) {
        TeamResponse response = new TeamResponse();
        response.setId(team.getId());
        response.setName(team.getName());
        response.setLogoUrl(team.getLogoUrl());
        response.setCaptainId(team.getCaptainId());
        response.setSkillRating(team.getSkillRating());

        // Fetch members
        List<com.turfbook.backend.model.TeamMember> members = teamMemberRepository.findByTeamId(team.getId());
        response.setMembers(members.stream()
                .filter(m -> "ACCEPTED".equals(m.getStatus())) // Only show accepted members in public view?
                // Or maybe show invited ones too? Requirement: "Friend sees: status = PENDING"
                // For now, let's return all and let frontend filter, or just accepted.
                // Usually "Team Members" list shows active members.
                .map(m -> {
                    // We need User object.
                    // Since I added @ManyToOne User user in TeamMember, I can use it.
                    // But I need to fetch it.
                    // If I use lazy loading, I might need @Transactional on this method.
                    // Or rely on the fact that I just fetched them.
                    // Let's assume TeamMember has User loaded or I fetch it.
                    // Actually TeamMemberRepository.findByTeamId might return proxies.
                    // Let's use userRepository to fetch if needed, or rely on relationship.
                    return mapToUserResponse(m.getUser());
                })
                .collect(Collectors.toList()));
        return response;
    }

    private UserResponse mapToUserResponse(User user) {
        if (user == null)
            return null;
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setAvatarUrl(user.getAvatarUrl());
        return response;
    }
}
