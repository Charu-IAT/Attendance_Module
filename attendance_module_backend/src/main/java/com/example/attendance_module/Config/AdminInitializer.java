package com.example.attendance_module.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.attendance_module.Model.Role;
import com.example.attendance_module.Model.User;
import com.example.attendance_module.Repo.RoleRepo;
import com.example.attendance_module.Repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepo.findByEmail("admin@gmail.com").isEmpty()) {

            Role adminRole = roleRepo.findByRole("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            User admin = new User();
            admin.setUserName("Admin");
            admin.setEmail("admin@gmail.com");
            admin.setUserPassword(passwordEncoder.encode("Admin@123"));
            admin.setRoleId(adminRole.getRoleId());
            userRepo.save(admin);

            System.out.println("Admin created successfully");
        }
    }
}