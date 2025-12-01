package com.turfbook.backend.service;

import com.turfbook.backend.model.Turf;
import com.turfbook.backend.model.TurfSlot;
import com.turfbook.backend.repository.TurfRepository;
import com.turfbook.backend.repository.TurfSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TurfService {
    @Autowired
    TurfRepository turfRepository;

    @Autowired
    TurfSlotRepository turfSlotRepository;

    public List<Turf> getAllTurfs(String location) {
        if (location != null && !location.isEmpty()) {
            return turfRepository.findByLocationContaining(location);
        }
        return turfRepository.findAll();
    }

    public Turf getTurfById(Long id) {
        return turfRepository.findById(id).orElseThrow(() -> new RuntimeException("Turf not found"));
    }

    public List<TurfSlot> getSlots(Long turfId, LocalDate date) {
        return turfSlotRepository.findByTurfIdAndDate(turfId, date);
    }

    @Transactional
    public List<TurfSlot> generateSlots(Long turfId, LocalDate date, LocalTime startTime, LocalTime endTime,
            int durationMinutes) {
        List<TurfSlot> slots = new ArrayList<>();
        LocalTime current = startTime;

        while (current.plusMinutes(durationMinutes).isBefore(endTime)
                || current.plusMinutes(durationMinutes).equals(endTime)) {
            TurfSlot slot = new TurfSlot();
            slot.setTurfId(turfId);
            slot.setDate(date);
            slot.setStartTime(current);
            slot.setEndTime(current.plusMinutes(durationMinutes));
            slot.setIsAvailable(true);
            slot.setIsLocked(false);

            slots.add(slot);
            current = current.plusMinutes(durationMinutes);
        }

        return turfSlotRepository.saveAll(slots);
    }
}
