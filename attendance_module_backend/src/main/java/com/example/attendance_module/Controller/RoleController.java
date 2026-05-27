package com.example.attendance_module.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_module.Dto.Request.RoleRequestDto;
import com.example.attendance_module.Dto.Response.RoleResponseDto;
import com.example.attendance_module.Service.RoleService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@Tag(name="Role Controller", description = "Role Based APIs")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PostMapping("/role")
    public RoleResponseDto createRole(@RequestBody RoleRequestDto request){
        return roleService.createRole(request);
    }
    
}
