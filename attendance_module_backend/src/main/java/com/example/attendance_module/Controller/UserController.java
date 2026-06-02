package com.example.attendance_module.Controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_module.Dto.Request.UpdatedUserRequestDto;
import com.example.attendance_module.Dto.Response.UserResponseDto;
import com.example.attendance_module.Service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@Tag(name="UserController", description="User APIs")
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController{
    private final UserService userService;
   
    @GetMapping("/viewUser")
    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    public List<UserResponseDto> viewCourse(){
        return userService.viewUser();
    }

    @GetMapping("/viewUser/{roleId}")
    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    public List<UserResponseDto> viewByRoleId(@PathVariable Long roleId){
        return userService.getUsersByRoleId(roleId);
    }

    @PutMapping("/updateUser/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    public String updateUser(
            @PathVariable Long userId,
            @RequestBody UpdatedUserRequestDto request) {

        return userService.updateUser(userId, request);
    }

    @DeleteMapping("/deleteUser/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    public String deleteUser(@PathVariable Long userId) {

        return userService.deleteUser(userId);
    }

   
    
}