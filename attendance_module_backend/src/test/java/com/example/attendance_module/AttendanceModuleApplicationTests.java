package com.example.attendance_module;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.attendance_module.Repo.UserRepo;
import com.example.attendance_module.Repo.RoleRepo;
import com.example.attendance_module.Repo.CourseRepo;
import com.example.attendance_module.Service.UserService;
import com.example.attendance_module.Dto.Request.UserRequestDto;

@SpringBootTest
class AttendanceModuleApplicationTests {

	@Autowired
	UserRepo userRepo;

	@Autowired
	RoleRepo roleRepo;

	@Autowired
	CourseRepo courseRepo;

	@Autowired
	UserService userService;

	@Test
	void contextLoads() {
		System.out.println("=== SEEDING USERS ===");
		if (!userRepo.findByEmail("admin@gmail.com").isPresent()) {
			UserRequestDto admin = UserRequestDto.builder()
				.userName("Admin User")
				.email("admin@gmail.com")
				.userPassword("Password@123")
				.roleId(1L)
				.build();
			userService.createUser(admin);
			System.out.println("Created admin@gmail.com / Password@123");
		}

		if (!userRepo.findByEmail("trainer@gmail.com").isPresent()) {
			UserRequestDto trainer = UserRequestDto.builder()
				.userName("Trainer User")
				.email("trainer@gmail.com")
				.userPassword("Password@123")
				.roleId(2L)
				.courseId(4L) // Cybersecurity course
				.build();
			userService.createUser(trainer);
			System.out.println("Created trainer@gmail.com / Password@123");
		}

		System.out.println("=== USERS ===");
		userRepo.findAll().forEach(u -> {
			System.out.println("User: ID=" + u.getUserId() + ", Name=" + u.getUserName() + ", Email=" + u.getEmail() + ", RoleID=" + u.getRoleId() + ", CourseID=" + u.getCourseId());
		});
		System.out.println("=== ROLES ===");
		roleRepo.findAll().forEach(r -> {
			System.out.println("Role: ID=" + r.getRoleId() + ", Name=" + r.getRoleName());
		});
		System.out.println("=== COURSES ===");
		courseRepo.findAll().forEach(c -> {
			System.out.println("Course: ID=" + c.getCourseId() + ", Name=" + c.getCourseName());
		});
	}

}
