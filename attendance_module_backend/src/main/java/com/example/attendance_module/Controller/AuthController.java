package com.example.attendance_module.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import com.example.attendance_module.Dto.Request.AuthRequestDto;
import com.example.attendance_module.Dto.Request.UserRequestDto;
import com.example.attendance_module.Dto.Response.AuthResponseDto;
import com.example.attendance_module.Dto.Response.UserResponseDto;
import com.example.attendance_module.Service.AuthService;
import com.example.attendance_module.Service.BlackListedTokenService;
import com.example.attendance_module.Service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth Controller",
description = "Authentication APIs")
public class AuthController {
    @Autowired
    AuthService authService;
    @Autowired
    UserService userService;
    @Autowired
    private BlackListedTokenService blacklistedTokenService;


    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody UserRequestDto request) {

        try {
            UserResponseDto response =
                    userService.createUser(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {
           Map<String, String> error = new HashMap<>();
           error.put("error", e.getMessage());
           return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthRequestDto request) {

        try {
            AuthResponseDto response =
                    authService.login(request);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
           Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error);
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>>
    handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(err ->
                        errors.put(
                                err.getField(),
                                err.getDefaultMessage()));
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            blacklistedTokenService.blacklistToken(token);
        }

        return ResponseEntity.ok("Logged out successfully");
    }
}