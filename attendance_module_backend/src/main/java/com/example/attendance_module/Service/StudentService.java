package com.example.attendance_module.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.StudentRequestDto;
import com.example.attendance_module.Dto.Request.UpdateStudentRequest;
import com.example.attendance_module.Dto.Response.StudentResponseDto;
import com.example.attendance_module.Enum.StudentGender;
import com.example.attendance_module.Model.Course;
import com.example.attendance_module.Model.Student;
import com.example.attendance_module.Model.User;
import com.example.attendance_module.Repo.CourseRepo;
import com.example.attendance_module.Repo.StudentRepo;
import com.example.attendance_module.Repo.UserRepo;
import com.example.attendance_module.Repo.AttendanceRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {


    @Autowired
    StudentRepo studentRepo;
    @Autowired
    UserRepo userRepo;
    @Autowired
    CourseRepo courseRepo;
    @Autowired
    AttendanceRepo attendanceRepo;

    private void validateDob(LocalDate dob) {

    if (dob == null) {
        throw new RuntimeException("Date of Birth is required");
    }

    if (dob.isAfter(LocalDate.now())) {
        throw new RuntimeException("Date of Birth cannot be in the future");
    }

    int age = Period.between(dob, LocalDate.now()).getYears();

    if (age < 10) {
        throw new RuntimeException("Student must be at least 10 years old");
    }
}

    private StudentResponseDto toStudentResponseDto(Student student, Course course) {
        User trainer = student.getUserId() != null ? userRepo.findById(student.getUserId()).orElse(null) : null;
        return StudentResponseDto.builder()
                .studentId(student.getStudentId())
                .studentName(student.getStudentName())
                .email(student.getEmail())
                .studentGender(student.getStudentGender())
                .studentDob(student.getStudentDob())
                .studentQualification(student.getStudentQualification())
                .address(student.getAddress())
                .courseName(course != null ? course.getCourseName() : null)
                .courseDuration(course != null ? course.getCourseDuration() : null)
                .createdDate(student.getCreatedDate())
                .userId(student.getUserId())
                .trainerName(trainer != null ? trainer.getUserName() : null)
                .build();
    }

    private StudentResponseDto studentCourseConnect(Student student, Course course) {
        StudentResponseDto dto = toStudentResponseDto(student, course);
        if (dto.getCourseName() == null) {
            dto.setCourseName("No Course");
        }
        return dto;
    }

    public StudentResponseDto createStudent(StudentRequestDto request){

        validateDob(request.getStudentDob());

        if (studentRepo.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email is already in use by another student");
        }

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
                            .address(request.getAddress())
                            .courseId(request.getCourseId())
                            .userId(request.getTrainerId())
                            .studentQualification(request.getStudentQualification())
                            .createdDate(request.getCreatedDate() != null ? request.getCreatedDate() : LocalDate.now())
                            .build();

                studentRepo.save(student);

        Course course = student.getCourseId() != null ? courseRepo.findById(student.getCourseId())
        .orElse(null) : null;
        
        return toStudentResponseDto(student, course);
    }

    public List<StudentResponseDto> viewAlltheStudents(){
        
        List<Student> students=studentRepo.findAll();
        return students.stream().map(student -> {
            Course course = student.getCourseId() != null ? courseRepo.findById(student.getCourseId())
                                      .orElse(null) : null;
            return toStudentResponseDto(student, course);
        }).toList();
    }

    public List<StudentResponseDto> viewStudentById(Long studentId){
        List<Student> students=studentRepo.findByStudentId(studentId);
        
        return students.stream().map(student -> {
            Course course = student.getCourseId() != null ? courseRepo.findById(student.getCourseId())
                                      .orElse(null) : null;
            return toStudentResponseDto(student, course);
        }).toList();
    }

    public List<StudentResponseDto> findByGender(StudentGender studentGender) {

        List<Student> students = studentRepo.findByGender(studentGender);

            return students.stream().map(student -> {
            Course course = student.getCourseId() != null ? courseRepo.findById(student.getCourseId())
                                      .orElse(null) : null;
            return toStudentResponseDto(student, course);
        }).toList();
    }

    public List<StudentResponseDto> viewStudentByCourse(String courseName) {

            Course course = courseRepo.findByCourseNames(courseName);

            if (course == null) {
                     throw new RuntimeException("Course not found : " + courseName);
            }

            List<Student> students = studentRepo.findStudentByCourse(course.getCourseId());

            return students.stream()
                .map(student -> toStudentResponseDto(student, course))
                .toList();
        }


    public List<StudentResponseDto> getStudentsByTrainerUserId() {

    String email = SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();

    User trainer = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Trainer not found"));

    System.out.println("Logged In User = " + trainer.getEmail());
    System.out.println("Role ID = " + trainer.getRoleId());

    if (!trainer.getRoleId().equals(2L)) {
        throw new AccessDeniedException("Only trainers can view students");
    }

    if (trainer.getCourseId() == null) {
        // Return empty list instead of throwing
        return List.of();
    }

    Course course = courseRepo.findByCourseId(trainer.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found"));

    List<Student> students = studentRepo.findStudentByCourse(course.getCourseId());

    return students.stream()
            .map(student -> studentCourseConnect(student, course))
            .toList();
}
    public StudentResponseDto updateStudent(Long studentId, UpdateStudentRequest request) {

        validateDob(request.getStudentDob());

        Student existing = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Student emailOwner = studentRepo.findByEmail(request.getEmail());
        if (emailOwner != null && !emailOwner.getStudentId().equals(studentId)) {
            throw new RuntimeException("Email is already in use by another student");
        }

        existing.setStudentName(request.getStudentName());
        existing.setEmail(request.getEmail());
        existing.setStudentGender(request.getStudentGender());
        existing.setStudentDob(request.getStudentDob());
        existing.setStudentQualification(request.getStudentQualification());
        existing.setAddress(request.getAddress());
        existing.setCourseId(request.getCourseId());
        existing.setUserId(request.getTrainerId());
        
        if (request.getCreatedDate() != null) {
            existing.setCreatedDate(request.getCreatedDate());
        }

        studentRepo.save(existing);

        Course course = existing.getCourseId() != null ? courseRepo.findById(existing.getCourseId()).orElse(null) : null;

        return toStudentResponseDto(existing, course);
    }

    public String deleteStudent(Long studentId) {

        // First clean up attendance records
        attendanceRepo.deleteByStudentId(studentId);

        int result = studentRepo.deleteStudent(studentId);

        if (result == 0) {
            throw new RuntimeException("Student not found");
        }

        return "Student Deleted Successfully";
    }
    };