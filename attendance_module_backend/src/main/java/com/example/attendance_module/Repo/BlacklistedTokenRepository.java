package com.example.attendance_module.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.attendance_module.Model.BlacklistedToken;

@Repository
public interface BlacklistedTokenRepository
        extends JpaRepository<BlacklistedToken, Long> {

    boolean existsByToken(String token);
}