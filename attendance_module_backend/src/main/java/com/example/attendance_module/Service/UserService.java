package com.example.attendance_module.Service;

import java.util.List;

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
                .userId(user.getUserId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .userDes(user.getUserDes())
                .roleName(role.getRoleName())
                .build();
    }

   public List<UserResponseDto> viewUser() {

    List<User> users = userRepository.findAll();

    if (users.isEmpty()) {
        throw new RuntimeException("User is Not Created");
    }

    return users.stream().map(user -> {

        Role role = roleRepository.findById(user.getRoleId())
                .orElse(null);

        return UserResponseDto.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .userDes(user.getUserDes())
                .roleName(role != null ? role.getRoleName() : null)
                .build();
    }).toList();
}
   public List<UserResponseDto> getUsersByRoleId(Long roleId) {

    List<User> users = userRepository.findByRoleId(roleId);

    Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new RuntimeException("Role not found"));

    return users.stream()
            .map(user -> UserResponseDto.builder()
                    .userId(user.getUserId())
                    .userName(user.getUserName())
                    .email(user.getEmail())
                    .userDes(user.getUserDes())
                    .roleName(role.getRoleName())
                    .build())
            .toList();
}

    
}