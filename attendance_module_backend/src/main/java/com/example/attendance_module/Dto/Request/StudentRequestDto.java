package com.example.attendance_module.Dto.Request;

import java.time.LocalDate;

import com.example.attendance_module.Enum.StudentGender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
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

    @Pattern(
        regexp = "^[a-zA-Z0-9\\s,./#-]+$",
        message = "Address cannot contain emojis or special symbols"
    )
    private String address;

    private Long courseId;

    private Long trainerId;
    
    private LocalDate createdDate;
}
