package com.turfbook.backend.controller;

import com.turfbook.backend.model.Turf;
import com.turfbook.backend.service.TurfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/turfs")
public class TurfController {
    @Autowired
    TurfService turfService;

    @GetMapping
    public List<Turf> getAllTurfs(@RequestParam(required = false) String location) {
        return turfService.getAllTurfs(location);
    }

    @GetMapping("/{id}")
    public Turf getTurfById(@PathVariable Long id) {
        return turfService.getTurfById(id);
    }
}
