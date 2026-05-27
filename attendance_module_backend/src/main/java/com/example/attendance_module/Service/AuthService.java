package com.example.attendance_module.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.AuthRequestDto;
import com.example.attendance_module.Dto.Response.AuthResponseDto;
import com.example.attendance_module.Model.User;
import com.example.attendance_module.Repo.UserRepo;
import com.example.attendance_module.Security.Jwt_Util;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final Jwt_Util jwtUtil;

    public AuthResponseDto login(AuthRequestDto request) {
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        String roleName = user.getRoleName().toUpperCase();

        boolean passwordMatches;
        if ("ADMIN".equals(roleName)) {
            passwordMatches = request.getPassword().equals(user.getUserPassword());
        } else {
            passwordMatches = passwordEncoder.matches(request.getPassword(), user.getUserPassword());
        }

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                roleName
        );

        return AuthResponseDto.builder()
                .userName(user.getUserName())
                .token(token)
                .message("Login successful")
                .build();
    }
}
