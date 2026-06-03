package com.example.attendance_module.Service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.StudentRequestDto;
import com.example.attendance_module.Dto.Response.StudentResponseDto;
import com.example.attendance_module.Enum.StudentGender;
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
    public List<StudentResponseDto> viewAlltheStudents(){
        List<Student> students=studentRepo.findAll();
        if(students.isEmpty()){
            throw new RuntimeException("Student is not created");
        }
        return students.stream().map(student->StudentResponseDto.builder()
                                            .studentId(student.getStudentId())
                                            .studentName(student.getStudentName())
                                            .studentDob(student.getStudentDob())
                                            .studentGender(student.getStudentGender())
                                            .studentQualification(student.getStudentQualification())
                                            .email(student.getEmail())
                                            .course(student.getCourse())
                                            .address(student.getAddress())
                                            .courseDuration(student.getCourseDuration())
                                            .build()).toList();
        
        }

    public List<StudentResponseDto> viewStudentById(Long studentId){
        List<Student> students=studentRepo.findByUserId(studentId);
        
        return students.stream().map(student->StudentResponseDto.builder()
                                            .studentId(student.getStudentId())
                                            .studentName(student.getStudentName())
                                            .studentDob(student.getStudentDob())
                                            .studentGender(student.getStudentGender())
                                            .studentQualification(student.getStudentQualification())
                                            .email(student.getEmail())
                                            .course(student.getCourse())
                                            .address(student.getAddress())
                                            .courseDuration(student.getCourseDuration())
                                            .build()).toList();
       }
    public List<StudentResponseDto> findByGender(StudentGender studentGender) {

        List<Student> students = studentRepo.findByGender(studentGender);

            if (students.isEmpty()) {
            throw new RuntimeException("No Students Found");
                }

            return students.stream().map(student->StudentResponseDto.builder()
                                            .studentId(student.getStudentId())
                                            .studentName(student.getStudentName())
                                            .studentDob(student.getStudentDob())
                                            .studentQualification(student.getStudentQualification())
                                            .email(student.getEmail())
                                            .course(student.getCourse())
                                            .address(student.getAddress())
                                            .courseDuration(student.getCourseDuration())
                                            .build()).toList();
    }

    
}