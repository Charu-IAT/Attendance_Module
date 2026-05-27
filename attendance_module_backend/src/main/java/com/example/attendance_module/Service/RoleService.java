package com.example.attendance_module.Service;

import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.RoleRequestDto;
import com.example.attendance_module.Dto.Response.RoleResponseDto;
import com.example.attendance_module.Model.Role;
import com.example.attendance_module.Repo.RoleRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepo roleRepo;

    public RoleResponseDto createRole(RoleRequestDto request){

        String roleName=request.getRoleName().toLowerCase();
        if(roleRepo.findByRole(roleName).isPresent()){
            throw new RuntimeException("Role already exist"+roleName);
        }
        
        Role role = Role.builder()
                .roleName(roleName)
                .build();

        roleRepo.save(role);

        return RoleResponseDto.builder()
                .roleName(role.getRoleName())
                .build();
    }
    }
    

