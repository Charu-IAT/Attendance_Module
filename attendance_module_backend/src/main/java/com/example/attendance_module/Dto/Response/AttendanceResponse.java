package com.example.attendance_module.Dto.Response;

import java.time.LocalDate;

import com.example.attendance_module.Enum.AttendanceStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttendanceResponse {

    private Long attendanceId;

    private String studentName;

    private String trainerName;

    private String courseName;

    private LocalDate attendanceDate;

    private AttendanceStatus attendanceStatus;

}
