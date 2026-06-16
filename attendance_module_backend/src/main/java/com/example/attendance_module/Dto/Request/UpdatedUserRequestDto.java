package com.example.attendance_module.Dto.Request;


import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatedUserRequestDto {

    @Pattern(
    regexp = "^[A-Za-z]+(?: [A-Za-z]+)*$",
    message = "Name should contain only letters and spaces"
    )
    @Size(max = 50, message = "Name must contain at most 20 characters")
    private String userName;

    @Pattern(
    regexp = "^[A-Za-z][A-Za-z0-9._]*@(gmail|yahoo|iattechnologies)\\.(com|co|in|co\\.in)$",
    message = "Only gmail, yahoo, and iattechnologies domains with .com, .co, .in, or .co.in are allowed"
    )
    @Size(max = 50, message = "Email must be at most 50 characters")
    private String email;

    private String userDes;

    private Long roleId;

    private Long courseId;
}
