package com.example.attendance_module.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.attendance_module.Dto.Request.AttendanceRequest;
import com.example.attendance_module.Dto.Request.DailyAttendanceRequest;
import com.example.attendance_module.Dto.Response.AttendanceResponse;
import com.example.attendance_module.Dto.Response.DashboardResponse;
import com.example.attendance_module.Enum.AttendanceStatus;
import com.example.attendance_module.Model.Attendance;
import com.example.attendance_module.Service.AttendanceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;


    @PreAuthorize("hasAnyAuthority('ROLE_admin','ROLE_trainer')")
    @PostMapping("/by-name")
    public AttendanceResponse markByName(@RequestBody AttendanceRequest request) {
        return attendanceService.markAttendanceByName(request);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_admin','ROLE_trainer')")
    @GetMapping
    public List<AttendanceResponse> getAll() {
        return attendanceService.getAll();
    }

    @PreAuthorize("hasAnyAuthority('ROLE_admin','ROLE_trainer')")
    @GetMapping("/by-date")
    public List<AttendanceResponse> getByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return attendanceService.getByDate(date);
    }

    @PreAuthorize("hasAuthority('ROLE_admin')")
    @GetMapping("/admin-dashboard")
    public DashboardResponse getAdminDashboard(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return attendanceService.getAdminDashboard(date);
    }

    @PreAuthorize("hasAuthority('ROLE_trainer')")
    @GetMapping("/trainer-dashboard")
    public DashboardResponse getTrainerDashboard(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return attendanceService.getTrainerDashboard(date);
    }


    @PreAuthorize("hasAnyAuthority('ROLE_admin','ROLE_trainer')")
    @PutMapping("/{attendanceId}")
    public Attendance update(@PathVariable Long attendanceId,
                             @RequestParam AttendanceStatus status) {
        return attendanceService.update(attendanceId, status);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_admin','ROLE_trainer')")
    @PutMapping("/by-student-id/{studentId}")
    public Attendance updateByStudentId(@PathVariable Long studentId,
                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                        @RequestParam AttendanceStatus status) {
        return attendanceService.updateAttendanceByStudentId(studentId, date, status);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_admin','ROLE_trainer')")
    @PutMapping("/by-student-name/{studentName}")
    public Attendance updateByStudentName(@PathVariable String studentName,
                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                          @RequestParam AttendanceStatus status) {
        return attendanceService.updateAttendanceByStudentName(studentName, date, status);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_admin')")
    @DeleteMapping("/{attendanceId}")
    public String delete(@PathVariable Long attendanceId) {
        return attendanceService.delete(attendanceId);
    }
}