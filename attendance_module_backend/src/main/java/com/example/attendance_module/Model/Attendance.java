package com.example.attendance_module.Model;

import java.time.LocalDate;

import org.springframework.cglib.core.Local;

import com.example.attendance_module.Enum.AttendanceStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="attendance_marking")
@Builder
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="attendance_id")
    private Long attendanceId;

    @Column(name="student_id")
    private Long studentId;

    @Column(name="user_id")
    private Long trainerUserId;

    @Column(name="course_id")
    private Long courseId;

    @Column(name="attendance_date")
    private LocalDate attendanceDate;

    @Column(name="status")
    private AttendanceStatus attendanceStatus;

    private String trainerName;




}
