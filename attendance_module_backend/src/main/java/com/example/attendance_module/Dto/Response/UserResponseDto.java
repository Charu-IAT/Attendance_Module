package com.example.attendance_module.Dto.Response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    
    private Long userId;

    private String userName;

    private String email;

    private String userDes;

    private String roleName;

}