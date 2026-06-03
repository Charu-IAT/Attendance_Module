package com.example.attendance_module.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.CourseRequestDto;
import com.example.attendance_module.Dto.Response.CourseResponseDto;
import com.example.attendance_module.Model.Course;
import com.example.attendance_module.Repo.CourseRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {
    @Autowired
    CourseRepo courseRepo;

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




}
