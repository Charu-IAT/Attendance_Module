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

        String normalizedRole = request.getRoleName()
                .trim()
                .toUpperCase();

        Role role = roleRepository.findByRole(normalizedRole)
                .orElseGet(() -> roleRepository.save(
                        Role.builder()
                                .roleName(normalizedRole)
                                .build()
                ));

        if (userRepository.existsByEmailAndRoleName(
                request.getEmail(),
                normalizedRole)) {

            throw new RuntimeException(
                    "Email already registered for this role");
        }

        
        User user = User.builder()
                .userName(request.getUserName())
                .email(request.getEmail())
                .userPassword(passwordEncoder.encode(request.getUserPassword()))
                .roleName(request.getRoleName())
                .build();

        userRepository.save(user);


        return UserResponseDto.builder()
                .userName(user.getUserName())
                .email(user.getEmail())
                .roleName(role.getRoleName())
                .build();
    }
}