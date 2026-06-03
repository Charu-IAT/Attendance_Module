package com.example.attendance_module.Repo;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.attendance_module.Model.Attendance;
import com.example.attendance_module.Enum.AttendanceStatus;

public interface AttendanceRepo extends JpaRepository<Attendance, Long> {

    @Query("SELECT a FROM Attendance a WHERE a.studentId = :studentId AND a.attendanceDate = :date")
    Optional<Attendance> findByStudentAndDate(@Param("studentId") Long studentId,
                                               @Param("date") LocalDate date);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Attendance a WHERE a.studentId = :studentId AND a.attendanceDate = :date")
    boolean existsByStudentAndDate(@Param("studentId") Long studentId,
                                    @Param("date") LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.trainerUserId = :trainerId")
    List<Attendance> findByTrainer(@Param("trainerId") Long trainerId);

    @Query("SELECT a FROM Attendance a WHERE a.courseId = :courseId")
    List<Attendance> findByCourse(@Param("courseId") Long courseId);


    @Query("SELECT a FROM Attendance a WHERE a.courseId = :courseId AND a.attendanceStatus = :status")
    List<Attendance> findByCourseAndStatus(@Param("courseId") Long courseId,
                                           @Param("status") AttendanceStatus status);

    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.courseId = :courseId AND a.attendanceStatus = :status")
    long countByCourseAndStatus(@Param("courseId") Long courseId,
                                @Param("status") AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.courseId = :courseId")
    long countTotalMarked(@Param("courseId") Long courseId);
}