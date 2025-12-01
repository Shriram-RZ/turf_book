package com.turfbook.backend.controller;

import com.turfbook.backend.model.*;
import com.turfbook.backend.model.enums.UserRole;
import com.turfbook.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/test")
public class DataSeederController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TurfRepository turfRepository;
    @Autowired
    private TurfSlotRepository turfSlotRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/seed")
    public ResponseEntity<?> seedData() {
        if (userRepository.existsByEmail("demo_player@example.com")) {
            return ResponseEntity.ok("Data already seeded!");
        }

        // 1. Create Users
        User player = new User();
        player.setName("Demo Player");
        player.setEmail("demo_player@example.com");
        player.setPassword(passwordEncoder.encode("password123"));
        player.setPhone("9876543210");
        player.setRole(UserRole.USER);
        player.setSkillRating(1500);
        player.setMatchesPlayed(10);
        player.setMatchesWon(6);
        userRepository.save(player);

        User owner = new User();
        owner.setName("Demo Owner");
        owner.setEmail("demo_owner@example.com");
        owner.setPassword(passwordEncoder.encode("password123"));
        owner.setPhone("9876543211");
        owner.setRole(UserRole.OWNER);
        userRepository.save(owner);

        // 2. Create Turfs
        createTurf(owner.getId(), "Green Valley Turf", "Downtown, City Center",
                Arrays.asList("Parking", "Water", "Changing Room"),
                Arrays.asList(
                        "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"),
                new BigDecimal("1200"));

        createTurf(owner.getId(), "Urban Kicks", "Westside Sports Complex",
                Arrays.asList("Floodlights", "Cafe", "Lockers"),
                Arrays.asList(
                        "https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"),
                new BigDecimal("1500"));

        createTurf(owner.getId(), "Skyline Arena", "Rooftop, Tech Park",
                Arrays.asList("Premium Turf", "Shower", "Spectator Area"),
                Arrays.asList(
                        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"),
                new BigDecimal("2000"));

        return ResponseEntity.ok("Data seeded successfully!");
    }

    private void createTurf(Long ownerId, String name, String location, List<String> amenities, List<String> images,
            BigDecimal price) {
        Turf turf = new Turf();
        turf.setOwnerId(ownerId);
        turf.setName(name);
        turf.setLocation(location);
        turf.setAmenities(amenities);
        turf.setImages(images);
        turf.setBasePrice(price);
        turf = turfRepository.save(turf);

        // Create Slots for next 7 days
        LocalDate today = LocalDate.now();
        for (int i = 0; i < 7; i++) {
            LocalDate date = today.plusDays(i);
            // Create slots from 6 AM to 10 PM
            for (int hour = 6; hour < 22; hour++) {
                TurfSlot slot = new TurfSlot();
                slot.setTurfId(turf.getId());
                slot.setDate(date);
                slot.setStartTime(LocalTime.of(hour, 0));
                slot.setEndTime(LocalTime.of(hour + 1, 0));
                slot.setIsAvailable(true);
                slot.setCustomPrice(price);
                turfSlotRepository.save(slot);
            }
        }
    }
}
