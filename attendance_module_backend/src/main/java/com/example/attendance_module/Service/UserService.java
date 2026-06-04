package com.example.attendance_module.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; 
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.UpdatedUserRequestDto;
import com.example.attendance_module.Dto.Request.UserRequestDto;
import com.example.attendance_module.Dto.Response.UserResponseDto;
import com.example.attendance_module.Model.Course;
import com.example.attendance_module.Model.Role;
import com.example.attendance_module.Model.User;
import com.example.attendance_module.Repo.CourseRepo;
import com.example.attendance_module.Repo.RoleRepo; 
import com.example.attendance_module.Repo.UserRepo; 
import lombok.RequiredArgsConstructor; 

@Service 
@RequiredArgsConstructor 
public class UserService { 
    @Autowired
    UserRepo userRepository; 
    @Autowired
    RoleRepo roleRepository; 
    @Autowired
    BCryptPasswordEncoder passwordEncoder; 
    @Autowired
    CourseRepo courseRepo;
    
   public UserResponseDto createUser(UserRequestDto request) {

    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already exists");
    }

    Role role = roleRepository.findById(request.getRoleId())
            .orElseThrow(() -> new RuntimeException("Role not found"));

    User user = new User();

    user.setUserName(request.getUserName());
    user.setEmail(request.getEmail());
    user.setUserDes(request.getUserDes());
    user.setUserPassword(passwordEncoder.encode(request.getUserPassword()));
    user.setRoleId(request.getRoleId());


    if (request.getRoleId() != null && request.getRoleId() == 1) {
        if (request.getCourseId() != null) {
            Course course = courseRepo.findById(request.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            user.setCourseId(course.getCourseId());
        } else {
            user.setCourseId(null);
        }
    }
    else if (request.getRoleId() != null && request.getRoleId() == 2) {

        if (request.getCourseId() == null) {
            throw new RuntimeException("Course Id is required for Trainer");
        }

        Course course = courseRepo.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        user.setCourseId(course.getCourseId());
    }

    User savedUser = userRepository.save(user);

    Course course = null;

    if (savedUser.getCourseId() != null) {
        course = courseRepo.findById(savedUser.getCourseId())
            .orElse(null);
}

    return UserResponseDto.builder()
            .userId(savedUser.getUserId())
            .userName(savedUser.getUserName())
            .email(savedUser.getEmail())
            .userDes(savedUser.getUserDes())
            .roleName(role.getRoleName())
            .courseName(course != null ? course.getCourseName() : null)
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
                Course course = user.getCourseId() != null ? courseRepo.findByCourseId(user.getCourseId())
                          .orElse(null) : null; 
        return UserResponseDto.builder() 
                              .userId(user.getUserId()) 
                              .userName(user.getUserName()) 
                              .email(user.getEmail()) 
                              .userDes(user.getUserDes()) 
                              .roleName(role != null ? role.getRoleName() : null) 
                              .courseName(course != null ? course.getCourseName() : null)
                              .build(); }).toList();
                            } 
                            
    public List<UserResponseDto> getUsersByRoleId(Long roleId) {

        List<User> users = userRepository.findByRoleId(roleId);

        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new RuntimeException("Role not found"));

        return users.stream().map(user -> {

                Course course = user.getCourseId() != null ? courseRepo.findById(user.getCourseId())
                                   .orElse(null) : null;

                return UserResponseDto.builder()
                                      .userId(user.getUserId())
                                      .userName(user.getUserName())
                                      .email(user.getEmail())
                                      .userDes(user.getUserDes())
                                      .roleName(role.getRoleName())
                                      .courseName(course != null ? course.getCourseName() : null)
                                      .build();
                                    }).toList();
        }


        public List<UserResponseDto> viewStudentByCourse(String courseName) {

                Course course = courseRepo.findByCourseName(courseName)
                           .orElseThrow(() -> new RuntimeException("Course not found"));

                List<User> users = userRepository.findByCourseId(course.getCourseId());

                if (users.isEmpty()) {
                        throw new RuntimeException("User not found in this course");
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
                                    .courseName(course.getCourseName())
                                    .build();
                                    }).toList();
}

          
    
    public UserResponseDto updateUser(Long userId, UpdatedUserRequestDto request) {

    Role role = roleRepository.findById(request.getRoleId())
            .orElseThrow(() -> new RuntimeException("Role not found"));

    int result = userRepository.updateUser(
            userId,
            request.getUserName(),
            request.getEmail(),
            request.getUserDes(),
            role.getRoleId()
    );

    if (result == 0) {
        throw new RuntimeException("User not found");
    }

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found after update"));

    Course course = user.getCourseId() != null ? courseRepo.findById(user.getCourseId()).orElse(null) : null;

    return UserResponseDto.builder()
            .userId(user.getUserId())
            .userName(user.getUserName())
            .email(user.getEmail())
            .userDes(user.getUserDes())
            .roleName(role.getRoleName())
            .courseName(course != null ? course.getCourseName() : null)
            .build();
}

    public String deleteUser(Long userId) {

        int result = userRepository.deleteUser(userId);

        if (result == 0) {
            throw new RuntimeException("User not found");
        }

        return "User Deleted Successfully";
    }
}
