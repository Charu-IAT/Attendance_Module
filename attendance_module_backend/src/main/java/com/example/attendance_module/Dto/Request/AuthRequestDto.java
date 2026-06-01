package com.example.attendance_module.Dto.Request;

import jakarta.validation.constraints.Email;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequestDto {
    
    @Email
    private String email;

    private String password;

}