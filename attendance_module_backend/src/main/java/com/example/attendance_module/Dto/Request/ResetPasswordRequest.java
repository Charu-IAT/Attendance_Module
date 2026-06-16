package com.example.attendance_module.Dto.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    @NotBlank(message = "Email is required")
    @Pattern(
    regexp = "^[A-Za-z][A-Za-z0-9._]*@(gmail|yahoo|iattechnologies)\\.(com|co|in|co\\.in)$",
    message = "Only gmail, yahoo, and iattechnologies domains with .com, .co, .in, or .co.in are allowed"
    )
    @Size(max = 50, message = "Email must be at most 50 characters")
    private String email;

    @NotBlank(message = "OTP is required")
    private String otp;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String newPassword;
}
