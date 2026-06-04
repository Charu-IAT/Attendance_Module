package com.example.attendance_module.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.attendance_module.Model.User;

import jakarta.transaction.Transactional;

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

    @Query("""
            SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END
            FROM User u
            WHERE u.email = :email
            """)
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u")
    List<User> viewUser();

    @Query("SELECT u FROM User u WHERE u.roleId = :roleId")
    List<User> findByRoleId(@Param("roleId") Long roleId);

    @Query("SELECT u FROM User u WHERE u.courseId = :courseId")
    List<User> findByCourseId(@Param("courseId") Long courseId);

    @Modifying
    @Transactional
    @Query("""
        UPDATE User u
        SET u.userName = :userName,
            u.email = :email,
            u.userDes = :userDes,
            u.roleId = :roleId
        WHERE u.userId = :userId
    """)
    int updateUser(
            @Param("userId") Long userId,
            @Param("userName") String userName,
            @Param("email") String email,
            @Param("userDes") String userDes,
            @Param("roleId") Long roleId);

    @Modifying
    @Transactional
    @Query("DELETE FROM User u WHERE u.userId = :userId")
    int deleteUser(@Param("userId") Long userId);
}