package com.turfbook.backend.controller;

import com.turfbook.backend.model.TurfSlot;
import com.turfbook.backend.repository.TurfSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/turfs")
public class TurfSlotController {

    @Autowired
    private TurfSlotRepository turfSlotRepository;

    @GetMapping("/{turfId}/slots")
    public ResponseEntity<List<TurfSlot>> getSlots(
            @PathVariable Long turfId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<TurfSlot> slots = turfSlotRepository.findByTurfIdAndDate(turfId, date);
        return ResponseEntity.ok(slots);
    }

    @PostMapping("/{turfId}/slots/generate")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> generateSlots(
            @PathVariable Long turfId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "06:00") String startTime,
            @RequestParam(defaultValue = "23:00") String endTime,
            @RequestParam(defaultValue = "60") int slotDurationMinutes,
            @RequestParam(defaultValue = "500") double pricePerSlot) {

        if (slotDurationMinutes <= 0) {
            return ResponseEntity.badRequest().body("Slot duration must be greater than 0");
        }

        System.out.println(
                "Generating slots: " + date + " " + startTime + " - " + endTime + " duration: " + slotDurationMinutes);

        LocalTime start = LocalTime.parse(startTime);
        LocalTime end = LocalTime.parse(endTime);

        if (end.isBefore(start)) {
            return ResponseEntity.badRequest()
                    .body("End time cannot be before start time (overnight slots not supported yet)");
        }

        List<TurfSlot> slots = new ArrayList<>();
        LocalTime currentTime = start;
        int safetyCounter = 0;
        while ((currentTime.plusMinutes(slotDurationMinutes).isBefore(end) ||
                currentTime.plusMinutes(slotDurationMinutes).equals(end)) && safetyCounter < 100) {
            TurfSlot slot = new TurfSlot();
            slot.setTurfId(turfId);
            slot.setDate(date);
            slot.setStartTime(currentTime);
            slot.setEndTime(currentTime.plusMinutes(slotDurationMinutes));
            slot.setCustomPrice(java.math.BigDecimal.valueOf(pricePerSlot));
            slot.setIsAvailable(true);

            slots.add(slot);
            currentTime = currentTime.plusMinutes(slotDurationMinutes);
            safetyCounter++;
        }

        if (safetyCounter >= 100) {
            System.err.println("Safety limit reached in slot generation!");
        }

        List<TurfSlot> savedSlots = turfSlotRepository.saveAll(slots);
        return ResponseEntity.ok(savedSlots);
    }
}
