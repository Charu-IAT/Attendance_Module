package com.example.attendance_module.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_module.Dto.Request.StudentRequestDto;
import com.example.attendance_module.Dto.Request.UpdateStudentRequest;
import com.example.attendance_module.Dto.Response.StudentResponseDto;
import com.example.attendance_module.Enum.StudentGender;
import com.example.attendance_module.Service.StudentService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@Tag(name="StudentController", description="Student APIs")
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {
    @Autowired
    StudentService studentService;

    @PostMapping("/addStudent")
    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    public StudentResponseDto createStudent( @RequestBody StudentRequestDto request){
        return studentService.createStudent(request);
    }

    @GetMapping("/getStudent")
    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    public List<StudentResponseDto> viewStudents(){
        return studentService.viewAlltheStudents();
    }

    @GetMapping("/getStudent/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    public List<StudentResponseDto> viewByStudentId(@PathVariable Long studentId){
        return studentService.viewStudentById(studentId);
    }

    @GetMapping("/getStudent/gender/{studentGender}")
    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    public List<StudentResponseDto> viewStudentByGender(@PathVariable("studentGender") StudentGender gender){
        return studentService.findByGender(gender);
    }

    @GetMapping("/getStudent/course/{course}")
    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    public List<StudentResponseDto> viewStudentByCourse(@PathVariable("course") String course){
        return studentService.viewStudentByCourse(course);
    }

  
    @PreAuthorize("hasAnyAuthority('ROLE_admin', 'ROLE_trainer')")
    @GetMapping("/trainer/students")
    public ResponseEntity<List<StudentResponseDto>> getTrainerStudents() {
         return ResponseEntity.ok(studentService.getStudentsByTrainerUserId());
   }

    @PutMapping("/update/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_admin', 'ROLE_trainer')")
    public StudentResponseDto updateStudent(@PathVariable Long studentId,
                                @RequestBody UpdateStudentRequest request) {
        return studentService.updateStudent(studentId, request);
    }

    @DeleteMapping("/delete/{studentId}")
     @PreAuthorize("hasAnyAuthority('ROLE_admin')")
     public String deleteStudent(@PathVariable Long studentId){
        return studentService.deleteStudent(studentId);
     }



}
