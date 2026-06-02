package com.example.attendance_module.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_module.Dto.Request.StudentRequestDto;
import com.example.attendance_module.Dto.Response.StudentResponseDto;
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

}
