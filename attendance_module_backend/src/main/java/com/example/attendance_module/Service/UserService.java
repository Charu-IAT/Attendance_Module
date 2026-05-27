package com.example.attendance_module.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.UserRequestDto;
import com.example.attendance_module.Dto.Response.UserResponseDto;
import com.example.attendance_module.Model.Role;
import com.example.attendance_module.Model.User;
import com.example.attendance_module.Repo.RoleRepo;
import com.example.attendance_module.Repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepository;
    private final RoleRepo roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserResponseDto createUser(UserRequestDto request) {

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        if (userRepository.existsByEmailAndRoleId(
                request.getEmail(),
                request.getRoleId())) {

            throw new RuntimeException(
                    "Email already registered for this role");
        }

        User user = User.builder()
                .userName(request.getUserName())
                .email(request.getEmail())
                .userDes(request.getUserDes())
                .userPassword(
                        passwordEncoder.encode(request.getUserPassword()))
                .roleId(role.getRoleId())
                .build();

        userRepository.save(user);

        return UserResponseDto.builder()
                .userName(user.getUserName())
                .email(user.getEmail())
                .userDes(user.getUserDes())
                .roleName(role.getRoleName())
                .build();
    }
}