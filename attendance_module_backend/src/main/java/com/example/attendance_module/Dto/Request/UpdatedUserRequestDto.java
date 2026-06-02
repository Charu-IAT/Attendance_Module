package com.example.attendance_module.Dto.Request;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatedUserRequestDto {

    private String userName;

    @Email
    private String email;

    private String userDes;

    private Long roleId;

}
