package com.example.attendance_module.Dto.Request;

import lombok.*;

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

    private Long roleId;
}