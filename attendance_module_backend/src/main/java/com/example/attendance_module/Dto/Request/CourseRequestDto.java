package com.example.attendance_module.Dto.Request;

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
public class CourseRequestDto {

    @Pattern(
    regexp = "^[A-Za-z]+(?: [A-Za-z]+)*$",
    message = "CourseName should contain only letters and spaces"
    )
    @Size(max = 20, message = "Course Name must be at most 20 characters")
    private String courseName;

    private Long courseDuration;
    

}
