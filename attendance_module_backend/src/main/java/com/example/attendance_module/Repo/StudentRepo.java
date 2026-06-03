package com.example.attendance_module.Repo;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.attendance_module.Enum.StudentGender;
import com.example.attendance_module.Model.Student;


public interface StudentRepo extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s WHERE s.email = :email")
    Student findByEmail(@Param("email") String email);

    @Query("SELECT s FROM Student s WHERE s.userId = :userId")
    List<Student> findByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM Student s WHERE s.studentGender = :gender")
    List<Student> findByGender(@Param("gender")  StudentGender studentGender);

    @Query("SELECT s FROM Student s")
    List<Student> viewAllStudents();

}
