package com.turfbook.backend.controller;

import com.turfbook.backend.dto.request.TeamRequest;
import com.turfbook.backend.dto.response.TeamResponse;
import com.turfbook.backend.repository.UserRepository;
import com.turfbook.backend.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @Autowired
    private UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).get().getId();
    }

    @PostMapping
    public ResponseEntity<?> createTeam(@RequestBody TeamRequest request) {
        try {
            Long userId = getCurrentUserId();
            TeamResponse team = teamService.createTeam(request, userId);
            return ResponseEntity.ok(team);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<TeamResponse>> getMyTeams() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(teamService.getMyTeams(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeam(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(teamService.getTeam(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<?> invitePlayer(@PathVariable Long id, @RequestParam Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            teamService.invitePlayer(id, userId, currentUserId);
            return ResponseEntity.ok("Player invited successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptInvite(@PathVariable Long id) {
        try {
            Long userId = getCurrentUserId();
            teamService.acceptInvite(id, userId);
            return ResponseEntity.ok("Joined team successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectInvite(@PathVariable Long id) {
        try {
            Long userId = getCurrentUserId();
            teamService.rejectInvite(id, userId);
            return ResponseEntity.ok("Invite rejected");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/remove")
    public ResponseEntity<?> removePlayer(@PathVariable Long id, @RequestParam Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            teamService.removePlayer(id, userId, currentUserId);
            return ResponseEntity.ok("Player removed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/invites")
    public ResponseEntity<?> getPendingInvites() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(teamService.getPendingInvites(userId));
    }
}
