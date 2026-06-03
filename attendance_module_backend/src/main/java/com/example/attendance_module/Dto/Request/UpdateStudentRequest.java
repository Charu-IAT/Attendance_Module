package com.example.attendance_module.Dto.Request;

import java.time.LocalDate;

import com.example.attendance_module.Enum.StudentGender;

import jakarta.validation.constraints.Email;
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


    private String studentName;

    @Email
    private String email;

    private StudentGender studentGender;

    private LocalDate studentDob;

    private String studentQualification;

    private String address;
    

}
