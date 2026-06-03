package com.example.attendance_module.Dto.Request;

import java.time.LocalDate;

import com.example.attendance_module.Enum.StudentGender;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequestDto {
    
    private String studentName;

    @Email
    private String email;

    private StudentGender studentGender;

    private LocalDate studentDob;

    private String studentQualification;

    private String address;

    private Long courseId;
    


    
}
