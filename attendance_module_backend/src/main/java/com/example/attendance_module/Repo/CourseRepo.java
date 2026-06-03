package com.example.attendance_module.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.attendance_module.Model.Course;

public interface CourseRepo extends JpaRepository<Course,Long> {

    @Query("SELECT c FROM Course c WHERE c.courseId = :courseId")
    Optional<Course> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT c FROM Course c WHERE c.courseName = :courseName")
    Optional<Course> findByCourseName(@Param("courseName") String courseName);
    
    @Query("SELECT c FROM Course c WHERE LOWER(c.courseName) = LOWER(:courseName)")
    Course findByCourseNames(@Param("courseName") String courseName);


}
