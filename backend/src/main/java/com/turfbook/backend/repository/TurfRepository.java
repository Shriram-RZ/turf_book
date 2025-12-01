package com.turfbook.backend.repository;

import com.turfbook.backend.model.Turf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TurfRepository extends JpaRepository<Turf, Long> {
    List<Turf> findByLocationContaining(String location);

    List<Turf> findByOwnerId(Long ownerId);

    long countByOwnerId(Long ownerId);
}
