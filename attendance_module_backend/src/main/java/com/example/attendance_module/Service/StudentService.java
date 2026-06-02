package com.example.attendance_module.Service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.StudentRequestDto;
import com.example.attendance_module.Dto.Response.StudentResponseDto;
import com.example.attendance_module.Model.Student;
import com.example.attendance_module.Model.User;
import com.example.attendance_module.Repo.StudentRepo;
import com.example.attendance_module.Repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepo studentRepo;
   
    private final UserRepo userRepo;
    public StudentResponseDto createStudent(StudentRequestDto request){

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User currentUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRoleId()!=1) {
            throw new AccessDeniedException("Only Admin can add student details");
        }

        Student student=Student.builder()
                            .studentName(request.getStudentName())
                            .email(request.getEmail())
                            .studentGender(request.getStudentGender())
                            .studentDob(request.getStudentDob())
                            .course(request.getCourse())
                            .courseDuration(request.getCourseDuration())
                            .address(request.getAddress())
                            .studentQualification(request.getStudentQualification())
                            .build();

                studentRepo.save(student);

        
            return StudentResponseDto.builder()
                                     .studentId(student.getStudentId())
                                     .studentName(student.getStudentName())
                                     .email(student.getEmail())
                                     .studentGender(student.getStudentGender())
                                     .studentDob(student.getStudentDob())
                                     .course(student.getCourse())
                                     .courseDuration(student.getCourseDuration())
                                     .address(student.getAddress())
                                     .studentQualification(student.getStudentQualification())
                                     .build();
                    }

}
