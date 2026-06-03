package com.example.attendance_module.Dto.Request;

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
public class AttendanceRequest {

    private Long studentId;

    private LocalDate attendanceDate;

    private AttendanceStatus attendanceStatus;


}
