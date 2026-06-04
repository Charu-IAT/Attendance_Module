package com.example.attendance_module.Repo;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import com.example.attendance_module.Model.Attendance;
import com.example.attendance_module.Enum.AttendanceStatus;

public interface AttendanceRepo extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate date);

    boolean existsByStudentIdAndAttendanceDate(Long studentId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.trainerUserId = :trainerId")
    List<Attendance> findByTrainer(@Param("trainerId") Long trainerId);

    @Query("SELECT a FROM Attendance a WHERE a.trainerUserId = :trainerId AND a.attendanceDate = :date")
    List<Attendance> findByTrainerAndDate(@Param("trainerId") Long trainerId,
                                          @Param("date") LocalDate date);

    
    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :date")
    List<Attendance> findByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.attendanceDate = :attendanceDate AND a.attendanceStatus = :attendanceStatus")
    long countByAttendanceDateAndAttendanceStatus(@Param("attendanceDate") LocalDate attendanceDate,
                                              @Param("attendanceStatus") AttendanceStatus attendanceStatus);
                                            
                                              
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.trainerUserId = :trainerUserId AND a.attendanceDate = :attendanceDate AND a.attendanceStatus = :attendanceStatus")
    long countByTrainerUserIdAndAttendanceDateAndAttendanceStatus(@Param("trainerUserId") Long trainerUserId,
                                                              @Param("attendanceDate") LocalDate attendanceDate,
                                                              @Param("attendanceStatus") AttendanceStatus attendanceStatus);
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

    @Query("SELECT a FROM Attendance a WHERE a.studentId = (SELECT s.studentId FROM Student s WHERE s.studentName = :studentName) AND a.attendanceDate = :date")
    Optional<Attendance> findByStudentNameAndAttendanceDate(@Param("studentName") String studentName, @Param("date") LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.studentId = (SELECT s.studentId FROM Student s WHERE s.studentName = :studentName)")
    List<Attendance> findByStudentName(@Param("studentName") String studentName);
}