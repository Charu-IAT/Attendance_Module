package com.example.attendance_module.Model;

import java.time.LocalDate;

import com.example.attendance_module.Enum.StudentGender;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name="student_details")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "student_id")
    private Long studentId;

    @Column(name="student_name")
    private String studentName;

    @Column(name="student_email")
    private String email;
    
    @Enumerated (EnumType.STRING)
    private StudentGender studentGender;

    @Column(name="student_dob")
    private LocalDate studentDob;

    @Column(name = "student_course")
    private String course;

    @Column(name="student_duration")
    private Long courseDuration;


    @Column(name="student_qualification")
    private String studentQualification;

    @Column(name = "address")
    private String address;

    @Column(name = "user_id")
    private Long userId;








    
}
