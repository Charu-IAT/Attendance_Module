package com.example.attendance_module.Dto.Request;

import java.time.LocalDate;

import com.example.attendance_module.Enum.StudentGender;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequestDto {
    
    private String studentName;

    @Email
    private String email;

    private StudentGender studentGender;

    private LocalDate studentDob;

    private Long courseDuration;

    private String studentQualification;

    private String address;
    


    
}
