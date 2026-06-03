package com.example.attendance_module.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_module.Dto.Request.CourseRequestDto;
import com.example.attendance_module.Dto.Response.CourseResponseDto;
import com.example.attendance_module.Service.CourseService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@Tag(name="CourseController", description="Course APIs")
@RequestMapping("/course")
@RequiredArgsConstructor
public class CourseController {

 @Autowired
 CourseService courseService;

 @PreAuthorize("hasAnyAuthority('ROLE_admin')")
 @PostMapping("/addcourse")
 public CourseResponseDto createCourse(@RequestBody CourseRequestDto request){
    return courseService.createCourse(request);
 }

}
