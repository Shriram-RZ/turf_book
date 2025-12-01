package com.turfbook.backend.controller;

import com.turfbook.backend.repository.TurfRepository;
import com.turfbook.backend.security.UserDetailsImpl;
import com.turfbook.backend.service.TurfService;
import com.turfbook.backend.model.Turf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('OWNER')")
public class OwnerController {

    @Autowired
    private TurfRepository turfRepository;

    @GetMapping("/turfs")
    public ResponseEntity<List<Turf>> getMyTurfs(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Turf> turfs = turfRepository.findByOwnerId(userDetails.getId());
        return ResponseEntity.ok(turfs);
    }

    @GetMapping("/turfs/{id}")
    public ResponseEntity<?> getTurfById(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return turfRepository.findById(id)
                .map(turf -> {
                    if (!turf.getOwnerId().equals(userDetails.getId())) {
                        return ResponseEntity.status(403).body("Not authorized to view this turf");
                    }
                    return ResponseEntity.ok(turf);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/turfs")
    public ResponseEntity<?> addTurf(@RequestBody Turf turf, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        turf.setOwnerId(userDetails.getId());
        Turf savedTurf = turfRepository.save(turf);
        return ResponseEntity.ok(savedTurf);
    }

    @PutMapping("/turfs/{id}")
    public ResponseEntity<?> updateTurf(@PathVariable Long id, @RequestBody Turf turf, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return turfRepository.findById(id)
                .map(existingTurf -> {
                    if (!existingTurf.getOwnerId().equals(userDetails.getId())) {
                        return ResponseEntity.status(403).body("Not authorized to update this turf");
                    }
                    existingTurf.setName(turf.getName());
                    existingTurf.setLocation(turf.getLocation());
                    existingTurf.setPricingRules(turf.getPricingRules());
                    existingTurf.setAmenities(turf.getAmenities());
                    existingTurf.setImages(turf.getImages());
                    Turf updated = turfRepository.save(existingTurf);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/turfs/{id}")
    public ResponseEntity<?> deleteTurf(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return turfRepository.findById(id)
                .map(turf -> {
                    if (!turf.getOwnerId().equals(userDetails.getId())) {
                        return ResponseEntity.status(403).body("Not authorized to delete this turf");
                    }
                    turfRepository.delete(turf);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
