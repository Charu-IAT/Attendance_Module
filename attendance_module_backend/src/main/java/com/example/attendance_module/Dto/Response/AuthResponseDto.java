package com.example.attendance_module.Dto.Response;


import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDto {

    private String userName;

    private String token;

    private String message;

    private String roleName;

    private Long userId;

    
}