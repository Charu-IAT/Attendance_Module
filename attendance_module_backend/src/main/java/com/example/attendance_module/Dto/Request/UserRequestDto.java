package com.example.attendance_module.Dto.Request;

import jakarta.validation.constraints.Email;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDto { 

    private String userName;

    @Email
    private String email;

    private String userDes;

    private String userPassword;


    private Long roleId;
}