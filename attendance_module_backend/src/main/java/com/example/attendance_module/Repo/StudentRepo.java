package com.example.attendance_module.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.attendance_module.Model.Student;


public interface StudentRepo extends JpaRepository<Student, Long> {

}
