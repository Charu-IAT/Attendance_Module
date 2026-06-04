package com.example.attendance_module.Service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.CourseRequestDto;
import com.example.attendance_module.Dto.Response.CourseResponseDto;
import com.example.attendance_module.Model.Course;
import com.example.attendance_module.Repo.CourseRepo;
import com.example.attendance_module.Repo.RoleRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {
    @Autowired
    CourseRepo courseRepo;
    @Autowired
    RoleRepo roleRepo;

    public CourseResponseDto createCourse(CourseRequestDto request){
      
        Course course=Course.builder()
                            .courseName(request.getCourseName())
                            .courseDuration(request.getCourseDuration())
                            .build();

           courseRepo.save(course);

        return CourseResponseDto.builder()
                                .courseId(course.getCourseId())
                                .courseName(course.getCourseName())
                                .courseDuration(course.getCourseDuration())
                                .build();
        
    }

    public List<CourseResponseDto> viewCourses(){
        List<Course> course=courseRepo.findAll();
        if(course.isEmpty()){
            throw new RuntimeException("Courses Not found");
        }
        return course.stream().map(courses->CourseResponseDto.builder()
                                                             .courseId(courses.getCourseId())
                                                             .courseName(courses.getCourseName())
                                                             .courseDuration(courses.getCourseDuration())
                                                             .build()).toList();
    }

    public CourseResponseDto updateCourseById(Long courseId, CourseRequestDto request){

        Long result = courseRepo.updateCourse(
            request.getCourseName(),
            request.getCourseDuration(),
            courseId
        );

        if(result == 0){
            throw new RuntimeException("Course not found");
        }

        Course course=courseRepo.findByCourseId(courseId)
                   .orElseThrow(()->new RuntimeException("Course not in this courseId"));

        return CourseResponseDto.builder()
                                .courseId(course.getCourseId())
                                .courseName(course.getCourseName())
                                .courseDuration(course.getCourseDuration())
                                .build();

    }



}
