package com.example.attendance_module.Dto.Request;


import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequestDto {
    
    
    private String email;

    
    private String password;

}