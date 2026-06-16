package com.example.attendance_module.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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
    @Autowired
    RoleService roleService;

    @PostMapping("/role")
    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    public RoleResponseDto createRole(@RequestBody RoleRequestDto request){
        return roleService.createRole(request);
    }
    
    @PreAuthorize("hasAnyAuthority('ROLE_admin','ROLE_trainer')")
    @GetMapping("/viewAllRole")
    public List<RoleResponseDto> viewAllRole(){
        return roleService.viewAllRole();
    }
}
