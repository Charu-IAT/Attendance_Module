package com.example.attendance_module.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.AttendanceRequest;
import com.example.attendance_module.Dto.Request.DailyAttendanceRequest;
import org.springframework.security.access.AccessDeniedException;

import com.example.attendance_module.Dto.Response.AttendanceResponse;
import com.example.attendance_module.Dto.Response.DashboardResponse;
import com.example.attendance_module.Enum.AttendanceStatus;
import com.example.attendance_module.Model.Attendance;
import com.example.attendance_module.Model.Course;
import com.example.attendance_module.Model.Role;
import com.example.attendance_module.Model.Student;
import com.example.attendance_module.Model.User;
import com.example.attendance_module.Repo.AttendanceRepo;
import com.example.attendance_module.Repo.CourseRepo;
import com.example.attendance_module.Repo.RoleRepo;
import com.example.attendance_module.Repo.StudentRepo;
import com.example.attendance_module.Repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepo attendanceRepo;
    private final UserRepo userRepo;
    private final StudentRepo studentRepo;
    private final CourseRepo courseRepo;
    private final RoleRepo roleRepo;

    private User getLoggedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AttendanceResponse createAttendance(AttendanceRequest request) {

        User trainer = getLoggedUser();

        Student student = studentRepo.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getCourseId().equals(trainer.getCourseId())) {
            throw new RuntimeException("Not your course student");
        }

        LocalDate date = request.getAttendanceDate() != null
                ? request.getAttendanceDate()
                : LocalDate.now();

        if (attendanceRepo.existsByStudentIdAndAttendanceDate(student.getStudentId(), date)) {
            throw new RuntimeException("Already marked");
        }

        Attendance att = Attendance.builder()
                .studentId(student.getStudentId())
                .trainerUserId(trainer.getUserId())
                .trainerName(trainer.getUserName())
                .courseId(trainer.getCourseId())
                .attendanceDate(date)
                .attendanceStatus(request.getAttendanceStatus())
                .build();

        attendanceRepo.save(att);

        Course course = trainer.getCourseId() != null ? courseRepo.findById(trainer.getCourseId()).orElse(null) : null;

        return AttendanceResponse.builder()
                .attendanceId(att.getAttendanceId())
                .studentName(student.getStudentName())
                .trainerName(trainer.getUserName())
                .courseName(course != null ? course.getCourseName() : null)
                .attendanceDate(date)
                .attendanceStatus(att.getAttendanceStatus())
                .build();
    }

    public List<AttendanceResponse> getAll() {
        User trainer = getLoggedUser();
        List<Attendance> attendances;

        if (isAdminUser(trainer)) {
            attendances = attendanceRepo.findAll();
        } else {
            attendances = attendanceRepo.findByTrainer(trainer.getUserId());
        }

        return toAttendanceResponseList(attendances);
    }

    public List<AttendanceResponse> getByDate(LocalDate date) {
        User trainer = getLoggedUser();
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<Attendance> attendances;

        if (isAdminUser(trainer)) {
            attendances = attendanceRepo.findByDate(targetDate);
        } else {
            attendances = attendanceRepo.findByTrainerAndDate(trainer.getUserId(), targetDate);
        }

        return toAttendanceResponseList(attendances);
    }

    private boolean isAdminUser(User user) {
        return roleRepo.findById(user.getRoleId())
                .map(role -> "admin".equalsIgnoreCase(role.getRoleName()))
                .orElse(false);
    }

    private List<AttendanceResponse> toAttendanceResponseList(List<Attendance> attendances) {
        return attendances.stream()
                .map(this::toAttendanceResponse)
                .collect(Collectors.toList());
    }

    private AttendanceResponse toAttendanceResponse(Attendance attendance) {
        Student student = studentRepo.findById(attendance.getStudentId()).orElse(null);
        User trainer = userRepo.findById(attendance.getTrainerUserId()).orElse(null);
        Course course = attendance.getCourseId() != null ? courseRepo.findById(attendance.getCourseId()).orElse(null) : null;

        return AttendanceResponse.builder()
                .attendanceId(attendance.getAttendanceId())
                .studentName(student != null ? student.getStudentName() : null)
                .trainerName(trainer != null ? trainer.getUserName() : null)
                .courseName(course != null ? course.getCourseName() : null)
                .attendanceDate(attendance.getAttendanceDate())
                .attendanceStatus(attendance.getAttendanceStatus())
                .build();
    }

    public DashboardResponse getAdminDashboard(LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();

        long totalStudents = studentRepo.count();
        long totalPresent = attendanceRepo.countByAttendanceDateAndAttendanceStatus(targetDate, AttendanceStatus.Present);
        long totalAbsent = attendanceRepo.countByAttendanceDateAndAttendanceStatus(targetDate, AttendanceStatus.Absent);
        long totalOngoing = Math.max(0, totalStudents );

        return DashboardResponse.builder()
                .totalStudents(totalStudents)
                .totalPresent(totalPresent)
                .totalAbsent(totalAbsent)
                .totalOngoing(totalOngoing)
                .build();
    }

    public DashboardResponse getTrainerDashboard(LocalDate date) {
        User trainer = getLoggedUser();
        verifyTrainerRole(trainer);
        LocalDate targetDate = date != null ? date : LocalDate.now();

        long totalStudents = studentRepo.countByCourseId(trainer.getCourseId());
        long totalPresent = attendanceRepo.countByTrainerUserIdAndAttendanceDateAndAttendanceStatus(trainer.getUserId(), targetDate, AttendanceStatus.Present);
        long totalAbsent = attendanceRepo.countByTrainerUserIdAndAttendanceDateAndAttendanceStatus(trainer.getUserId(), targetDate, AttendanceStatus.Absent);
        long totalOngoing = Math.max(0, totalStudents - totalPresent - totalAbsent);

        return DashboardResponse.builder()
                .trainerId(trainer.getUserId())
                .trainerName(trainer.getUserName())
                .totalStudents(totalStudents)
                .totalPresent(totalPresent)
                .totalAbsent(totalAbsent)
                .totalOngoing(totalOngoing)
                .build();
    }

    private void verifyTrainerRole(User user) {
        Role role = roleRepo.findById(user.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        if (!"trainer".equalsIgnoreCase(role.getRoleName())) {
            throw new AccessDeniedException("Trainer dashboard access is restricted to trainers only");
        }
    }

    public List<AttendanceResponse> createDailyAttendance(DailyAttendanceRequest request) {
        User trainer = getLoggedUser();

        LocalDate date = request.getAttendanceDate() != null
                ? request.getAttendanceDate()
                : LocalDate.now();

        if (request.getAttendanceRecords() == null || request.getAttendanceRecords().isEmpty()) {
            throw new RuntimeException("Attendance records cannot be empty");
        }

        List<Attendance> attendances = new ArrayList<>();

        for (AttendanceRequest record : request.getAttendanceRecords()) {
            Student student = studentRepo.findById(record.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            if (!student.getCourseId().equals(trainer.getCourseId())) {
                throw new RuntimeException("Not your course student");
            }

            if (attendanceRepo.existsByStudentIdAndAttendanceDate(student.getStudentId(), date)) {
                throw new RuntimeException("Attendance already marked for student id: " + student.getStudentId());
            }

            Attendance att = Attendance.builder()
                    .studentId(student.getStudentId())
                    .trainerUserId(trainer.getUserId())
                    .trainerName(trainer.getUserName())
                    .courseId(trainer.getCourseId())
                    .attendanceDate(date)
                    .attendanceStatus(record.getAttendanceStatus())
                    .build();

            attendances.add(att);
        }

        attendanceRepo.saveAll(attendances);

        return attendances.stream()
                .map(att -> {
                    Student student = studentRepo.findById(att.getStudentId()).orElse(null);
                    Course course = trainer.getCourseId() != null ? courseRepo.findById(trainer.getCourseId()).orElse(null) : null;
                    return AttendanceResponse.builder()
                            .attendanceId(att.getAttendanceId())
                            .studentName(student != null ? student.getStudentName() : null)
                            .trainerName(trainer.getUserName())
                            .courseName(course != null ? course.getCourseName() : null)
                            .attendanceDate(att.getAttendanceDate())
                            .attendanceStatus(att.getAttendanceStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public Attendance update(Long attendanceId, AttendanceStatus status) {

        Attendance att = attendanceRepo.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Not found"));

        att.setAttendanceStatus(status);

        return attendanceRepo.save(att);
    }

    public AttendanceResponse markAttendanceByName(AttendanceRequest request) {

        User trainer = getLoggedUser();

        Student student = studentRepo.findByStudentName(request.getStudentName())
                .orElseThrow(() -> new RuntimeException("Student not found with name: " + request.getStudentName()));

        if (!student.getCourseId().equals(trainer.getCourseId())) {
            throw new RuntimeException("Not your course student");
        }

        LocalDate date = request.getAttendanceDate() != null
                ? request.getAttendanceDate()
                : LocalDate.now();

        if (attendanceRepo.existsByStudentIdAndAttendanceDate(student.getStudentId(), date)) {
            throw new RuntimeException("Already marked");
        }

        Attendance att = Attendance.builder()
                .studentId(student.getStudentId())
                .trainerUserId(trainer.getUserId())
                .trainerName(trainer.getUserName())
                .courseId(trainer.getCourseId())
                .attendanceDate(date)
                .attendanceStatus(request.getAttendanceStatus())
                .build();

        attendanceRepo.save(att);

        Course course = trainer.getCourseId() != null ? courseRepo.findById(trainer.getCourseId()).orElse(null) : null;

        return AttendanceResponse.builder()
                .attendanceId(att.getAttendanceId())
                .studentName(student.getStudentName())
                .trainerName(trainer.getUserName())
                .courseName(course != null ? course.getCourseName() : null)
                .attendanceDate(date)
                .attendanceStatus(att.getAttendanceStatus())
                .build();
    }

    public Attendance updateAttendanceByStudentId(Long studentId, LocalDate date, AttendanceStatus status) {

        Attendance att = attendanceRepo.findByStudentIdAndAttendanceDate(studentId, date)
                .orElseThrow(() -> new RuntimeException("Attendance record not found for student id: " + studentId + " on date: " + date));

        att.setAttendanceStatus(status);

        return attendanceRepo.save(att);
    }

    public Attendance updateAttendanceByStudentName(String studentName, LocalDate date, AttendanceStatus status) {

        Attendance att = attendanceRepo.findByStudentNameAndAttendanceDate(studentName, date)
                .orElseThrow(() -> new RuntimeException("Attendance record not found for student: " + studentName + " on date: " + date));

        att.setAttendanceStatus(status);

        return attendanceRepo.save(att);
    }

    public String delete(Long attendanceId) {
        attendanceRepo.deleteById(attendanceId);
        return "Deleted";
    }
}