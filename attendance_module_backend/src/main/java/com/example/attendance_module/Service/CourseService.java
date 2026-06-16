package com.example.attendance_module.Service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.CourseRequestDto;
import com.example.attendance_module.Dto.Response.CourseResponseDto;
import com.example.attendance_module.Model.Course;
import com.example.attendance_module.Repo.CourseRepo;
import com.example.attendance_module.Repo.RoleRepo;
import com.example.attendance_module.Repo.StudentRepo;
import com.example.attendance_module.Repo.UserRepo;
import com.example.attendance_module.Repo.AttendanceRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {
    @Autowired
    CourseRepo courseRepo;
    @Autowired
    RoleRepo roleRepo;
    @Autowired
    StudentRepo studentRepo;
    @Autowired
    UserRepo userRepo;
    @Autowired
    AttendanceRepo attendanceRepo;

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
        return course.stream().map(courses->CourseResponseDto.builder()
                                                             .courseId(courses.getCourseId())
                                                             .courseName(courses.getCourseName())
                                                             .courseDuration(courses.getCourseDuration())
                                                             .build()).toList();
    }

    @jakarta.transaction.Transactional
    public CourseResponseDto updateCourseById(Long courseId, CourseRequestDto request){

        Course course=courseRepo.findByCourseId(courseId)
                   .orElseThrow(()->new RuntimeException("Course not in this courseId"));

        course.setCourseName(request.getCourseName());
        course.setCourseDuration(request.getCourseDuration());
        courseRepo.save(course);

        return CourseResponseDto.builder()
                                .courseId(course.getCourseId())
                                .courseName(course.getCourseName())
                                .courseDuration(course.getCourseDuration())
                                .build();

    }

    @jakarta.transaction.Transactional
    public String deleteCourse(Long courseId) {
        Course course = courseRepo.findByCourseId(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        studentRepo.disassociateCourse(courseId);
        userRepo.disassociateCourse(courseId);
        attendanceRepo.deleteByCourseId(courseId);

        courseRepo.delete(course);

        return "Course Deleted Successfully";
    }
}
