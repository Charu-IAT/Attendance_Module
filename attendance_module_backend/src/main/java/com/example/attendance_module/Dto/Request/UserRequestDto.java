package com.example.attendance_module.Dto.Request;

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
public class UserRequestDto {
    private Long userId;

    private String userName;

    private String email;

    private String userDes;

    private String userPassword;

    private String roleName;


    
}
