package com.example.attendance_module.Dto.Request;

import java.time.LocalDate;

import com.example.attendance_module.Enum.StudentGender;


import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStudentRequest {

    @Pattern(
    regexp = "^[A-Za-z]+(?: [A-Za-z]+)*$",
    message = "Name should contain only letters and spaces"
    )
    @Size(max = 50, message = "Student Name must be at most 20 characters")
    private String studentName;

    @Pattern(
    regexp = "^[A-Za-z][A-Za-z0-9._]*@(gmail|yahoo|iattechnologies)\\.(com|co|in|co\\.in)$",
    message = "Only gmail, yahoo, and iattechnologies domains with .com, .co, .in, or .co.in are allowed"
    )
    @Size(max = 50, message = "Email must be at most 50 characters")
    private String email;

    private StudentGender studentGender;

    private LocalDate studentDob;
    
    @Pattern(
    regexp = "^[A-Za-z. ]{2,30}$",
    message = "Degree should contain only letters, spaces, and dots"
    )
    private String studentQualification;

    private String address;

    private Long courseId;

    private Long trainerId;

    private LocalDate createdDate;
}
