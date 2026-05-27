package com.example.attendance_module.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.attendance_module.Model.User;

public interface UserRepo extends JpaRepository<User, Long>{
    @Query("SELECT u FROM User u WHERE u.email=:email")
    Optional<User> findByEmail(@Param("email") String email);


    boolean existsByEmailAndRoleName(String email, String normalizedRole);
    
    
}
