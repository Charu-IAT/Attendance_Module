package com.example.attendance_module.Dto.Response;

import java.time.LocalDate;

import com.example.attendance_module.Enum.StudentGender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponseDto {
    private Long studentId;

    private String studentName;

    private String email;

    private StudentGender studentGender;

    private LocalDate studentDob;

    private String courseName;

    private Long courseDuration;

    private String studentQualification;

    private String address;

    private LocalDate createdDate;
   
    private Long userId;

    private String trainerName;
}
