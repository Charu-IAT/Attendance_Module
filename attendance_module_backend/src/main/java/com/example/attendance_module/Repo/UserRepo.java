package com.example.attendance_module.Repo;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.attendance_module.Model.User;

public interface UserRepo extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    @Query("""
            SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END
            FROM User u
            WHERE u.email = :email
            AND u.roleId = :roleId
            """)
    boolean existsByEmailAndRoleId(
            @Param("email") String email,
            @Param("roleId") Long roleId);

    @Query("SELECT u FROM User u")
    List<User> viewUser();
    
    @Query("SELECT u FROM User u WHERE u.roleId=:roleId")
    List<User> findByRoleId(@Param("roleId") Long roleId);
}