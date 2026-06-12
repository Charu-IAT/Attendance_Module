package com.example.attendance_module.Service;

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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

    private static final long trainer_id = 1L;

    @Autowired
    StudentRepo studentRepo;
    @Autowired
    UserRepo userRepo;
    @Autowired
    CourseRepo courseRepo;

    private StudentResponseDto studentCourseConnect(Student student, Course course) {

    return StudentResponseDto.builder()
            .studentId(student.getStudentId())
            .studentName(student.getStudentName())
            .email(student.getEmail())
            .studentGender(student.getStudentGender())
            .studentDob(student.getStudentDob())
            .studentQualification(student.getStudentQualification())
            .address(student.getAddress())
            .courseName(course != null ? course.getCourseName() : "No Course")
            .courseDuration(course != null ? course.getCourseDuration() : null)
            .build();
}

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
                            .address(request.getAddress())
                            .courseId(request.getCourseId())
                            .studentQualification(request.getStudentQualification())
                            .build();

                studentRepo.save(student);

        Course course = student.getCourseId() != null ? courseRepo.findById(student.getCourseId())
        .orElse(null) : null;
        
            return StudentResponseDto.builder()
                                     .studentId(student.getStudentId())
                                     .studentName(student.getStudentName())
                                     .email(student.getEmail())
                                     .studentGender(student.getStudentGender())
                                     .studentDob(student.getStudentDob())
                                     .address(student.getAddress())
                                     .studentQualification(student.getStudentQualification())
                                     .courseName(course != null ? course.getCourseName() : null)
                                     .courseDuration(course != null ? course.getCourseDuration() : null)
                                     .build();
    }

    public List<StudentResponseDto> viewAlltheStudents(){
        
        List<Student> students=studentRepo.findAll();
        if(students.isEmpty()){
            throw new RuntimeException("Student is not created");
        }
        return students.stream().map(student -> {

        Course course = student.getCourseId() != null ? courseRepo.findById(student.getCourseId())
                                  .orElse(null) : null;

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
                                 .build();
                                }).toList();
                            }

    public List<StudentResponseDto> viewStudentById(Long studentId){
        List<Student> students=studentRepo.findByStudentId(studentId);
        
        return students.stream().map(student -> {

        Course course = student.getCourseId() != null ? courseRepo.findById(student.getCourseId())
                                  .orElse(null) : null;

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
                                 .build();
                                }).toList();
                            }

    public List<StudentResponseDto> findByGender(StudentGender studentGender) {

        List<Student> students = studentRepo.findByGender(studentGender);

            if (students.isEmpty()) {
            throw new RuntimeException("No Students Found");
                }

            return students.stream().map(student -> {

        Course course = student.getCourseId() != null ? courseRepo.findById(student.getCourseId())
                                  .orElse(null) : null;

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
                                 .build();
                                }).toList();
                            }

    public List<StudentResponseDto> viewStudentByCourse(String courseName) {

            Course course = courseRepo.findByCourseNames(courseName);

            if (course == null) {
                     throw new RuntimeException("Course not found : " + courseName);
            }

            List<Student> students = studentRepo.findStudentByCourse(course.getCourseId());

            if (students.isEmpty()) { 
                throw new RuntimeException( "No students assigned to course : " + courseName);
            }

            return students.stream().map(student -> StudentResponseDto.builder()
                                    .studentId(student.getStudentId())
                                    .studentName(student.getStudentName())
                                    .email(student.getEmail())
                                    .studentGender(student.getStudentGender())
                                    .studentDob(student.getStudentDob())
                                    .studentQualification(student.getStudentQualification())
                                    .address(student.getAddress())
                                    .courseName(course.getCourseName())
                                    .courseDuration(course.getCourseDuration())
                                    .build())
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
        throw new RuntimeException("No course assigned to this trainer");
    }

    Course course = courseRepo.findByCourseId(trainer.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found"));

    List<Student> students = studentRepo.findStudentByCourse(course.getCourseId());

    if (students.isEmpty()) {
        throw new RuntimeException("No students found");
    }

    return students.stream()
            .map(student -> studentCourseConnect(student, course))
            .toList();
}
    public StudentResponseDto updateStudent(Long studentId, UpdateStudentRequest request) {

        Long result = studentRepo.updateStudent(
            studentId,
            request.getStudentName(),
            request.getEmail(),
            request.getStudentQualification(),
            request.getStudentDob(),
            request.getAddress(),
            request.getStudentGender()
    );

    if (result == 0) {
        throw new RuntimeException("Student not found");
    }

    Student student = studentRepo.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

    Course course = student.getCourseId() != null ? courseRepo.findById(student.getCourseId()).orElse(null) : null;

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
            .build();
}

    public String deleteStudent(Long studentId) {

        int result = studentRepo.deleteStudent(studentId);

        if (result == 0) {
            throw new RuntimeException("Student not found");
        }

        return "Student Deleted Successfully";
    }
    };