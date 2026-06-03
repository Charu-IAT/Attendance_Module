package com.example.attendance_module.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.attendance_module.Dto.Request.AttendanceRequest;
import com.example.attendance_module.Dto.Response.AttendanceResponse;
import com.example.attendance_module.Enum.AttendanceStatus;
import com.example.attendance_module.Model.Attendance;
import com.example.attendance_module.Service.AttendanceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public AttendanceResponse create(@RequestBody AttendanceRequest request) {
        return attendanceService.createAttendance(request);
    }

    @GetMapping
    public List<Attendance> getAll() {
        return attendanceService.getAll();
    }

    @PutMapping("/{studentId}")
    public Attendance update(@PathVariable Long studentId, @RequestParam AttendanceStatus status) {
        return attendanceService.update(studentId, status);
    }

    @DeleteMapping("/{studentId}")
    public String delete(@PathVariable Long studentId) {
        return attendanceService.delete(studentId);
    }
}