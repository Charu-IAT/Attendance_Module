package com.example.attendance_module.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private Long userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_mail")
    private String email;

    @Column(name = "user_des")
    private String userDes;

    @Column(name = "user_password")
    private String userPassword;

    @Column(name = "role_id")
    private Long roleId;

    @Column(name="course_id")
    private Long courseId;




}