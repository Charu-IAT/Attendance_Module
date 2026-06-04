package com.example.attendance_module.Dto.Request;

import java.time.LocalDate;
import java.util.List;

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
public class DailyAttendanceRequest {

    private LocalDate attendanceDate;

    private List<AttendanceRequest> attendanceRecords;

}
