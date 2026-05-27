package com.example.attendance_module.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.AuthRequestDto;
import com.example.attendance_module.Dto.Response.AuthResponseDto;
import com.example.attendance_module.Model.Role;
import com.example.attendance_module.Model.User;
import com.example.attendance_module.Repo.RoleRepo;
import com.example.attendance_module.Repo.UserRepo;
import com.example.attendance_module.Security.Jwt_Util;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepository;
    private final RoleRepo roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final Jwt_Util jwtUtil;

    public AuthResponseDto login(AuthRequestDto request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getUserPassword());

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        Role role = roleRepository.findById(user.getRoleId())
                .orElseThrow(() ->
                        new RuntimeException("Role not found"));

        String token = jwtUtil.generateToken(
                user.getEmail(),
                role.getRoleName());

        return AuthResponseDto.builder()
                .userName(user.getUserName())
                .token(token)
                .message("Login successful")
                .roleName(role.getRoleName())
                .build();
    }
}