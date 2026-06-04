package com.example.attendance_module.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.attendance_module.Model.Course;

import jakarta.transaction.Transactional;

public interface CourseRepo extends JpaRepository<Course,Long> {

    @Query("SELECT c FROM Course c WHERE c.courseId = :courseId")
    Optional<Course> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT c FROM Course c WHERE c.courseName = :courseName")
    Optional<Course> findByCourseName(@Param("courseName") String courseName);
    
    @Query("SELECT c FROM Course c WHERE c.courseName = :courseName")
    Course findByCourseNames(@Param("courseName") String courseName);

    @Query("SELECT c FROM Course c")
    List<Course> viewCourse();

    @Modifying
    @Transactional
    @Query("UPDATE Course c SET c.courseName = :courseName, c.courseDuration = :courseDuration WHERE c.courseId = :courseId")
    Long updateCourse(@Param("courseName") String courseName,
                     @Param("courseDuration") Long courseDuration,
                     @Param("courseId") Long courseId);

   
    
}
