package com.example.attendance_module.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.attendance_module.Model.Role;

public interface RoleRepo extends JpaRepository<Role, Long> {

    @Query("SELECT r FROM Role r WHERE r.roleName = :roleName")
    Optional<Role> findByRole(@Param("roleName") String roleName);

    @Query("SELECT r FROM Role r")
    List<Role> viewAllRoles();
}