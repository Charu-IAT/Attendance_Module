package com.example.attendance_module.Dto.Response;

import java.time.LocalDate;

import com.example.attendance_module.Enum.StudentGender;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponseDto {
    private Long studentId;

    private String email;

    private StudentGender studentGender;

    private LocalDate studentDob;

    private Long courseDuration;

    private String studentQualification;

    private String address;

    
}
