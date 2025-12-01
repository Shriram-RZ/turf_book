package com.turfbook.backend.repository;

import com.turfbook.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    java.util.List<User> findByNameContainingOrEmailContaining(String name, String email);

    java.util.List<User> findByNameContainingIgnoreCase(String name);
}
