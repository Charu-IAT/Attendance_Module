package com.example.attendance_module.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="user")
@Getter
@Setter
@Builder
public class User {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long userId;

private String userName;

private String email;

private String userDes;

private String userPassword;

private String roleName;


    
}
