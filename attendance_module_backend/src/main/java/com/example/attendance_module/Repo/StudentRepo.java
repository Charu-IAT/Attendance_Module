package com.example.attendance_module.Repo;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.attendance_module.Enum.StudentGender;
import com.example.attendance_module.Model.Student;
import com.example.attendance_module.Model.User;

import jakarta.transaction.Transactional;


public interface StudentRepo extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s WHERE s.email = :email")
    Student findByEmail(@Param("email") String email);

    @Query("SELECT s FROM Student s WHERE s.studentId = :studentId")
    List<Student> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT s FROM Student s WHERE s.studentGender = :gender")
    List<Student> findByGender(@Param("gender")  StudentGender studentGender);

    @Query("SELECT s FROM Student s")
    List<Student> viewAllStudents();

    @Query("SELECT s FROM Student s WHERE s.courseId = :courseId")
    List<Student> findStudentByCourse(@Param("courseId") Long courseId);

    long countByCourseId(Long courseId);

    @Query("SELECT u FROM User u WHERE u.userName = :userName")
    Optional<User> findByUserName(@Param("userName") String userName);

    @Modifying
    @Transactional
    @Query("""
    UPDATE Student s
    SET s.studentName=:studentName,
        s.email=:email,
        s.studentQualification=:studentQualification,
        s.studentDob=:studentDob,
        s.address=:address,
        s.studentGender=:studentGender
    WHERE s.studentId = :studentId
       """)
    Long updateStudent(
        @Param("studentId") Long studentId,
        @Param("studentName") String studentName,
        @Param("email") String email,
        @Param("studentQualification") String studentQualification,
        @Param("studentDob") LocalDate studentDob,
        @Param("address") String address,
        @Param("studentGender") StudentGender studentGender
    );

    @Query("SELECT s FROM Student s WHERE s.studentName = :studentName")
    Optional<Student> findByStudentName(@Param("studentName") String studentName);

    @Modifying
    @Transactional
    @Query("DELETE FROM  Student s WHERE s.studentId=:studentId")
    int deleteStudent(@Param("studentId") Long studentId);


}
