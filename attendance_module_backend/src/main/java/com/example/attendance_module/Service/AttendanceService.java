package com.example.attendance_module.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.attendance_module.Dto.Request.AttendanceRequest;
import com.example.attendance_module.Dto.Response.AttendanceResponse;
import com.example.attendance_module.Enum.AttendanceStatus;
import com.example.attendance_module.Model.Attendance;
import com.example.attendance_module.Model.Course;
import com.example.attendance_module.Model.Student;
import com.example.attendance_module.Model.User;
import com.example.attendance_module.Repo.AttendanceRepo;
import com.example.attendance_module.Repo.CourseRepo;
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

    private final long TRAINER_ROLE_ID = 2L;

    private User getTrainer() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User trainer = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!trainer.getRoleId().equals(TRAINER_ROLE_ID)) {
            throw new RuntimeException("Only trainer allowed");
        }

        return trainer;
    }

    public AttendanceResponse createAttendance(AttendanceRequest request) {

        User trainer = getTrainer();

        Student student = studentRepo.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getCourseId().equals(trainer.getCourseId())) {
            throw new RuntimeException("Not your course student");
        }

        LocalDate date = request.getAttendanceDate() != null
                ? request.getAttendanceDate()
                : LocalDate.now();

        if (attendanceRepo.existsByStudentAndDate(student.getStudentId(), date)) {
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

        Course course = courseRepo.findById(trainer.getCourseId()).orElse(null);

        return AttendanceResponse.builder()
                .attendanceId(att.getAttendanceId())
                .studentName(student.getStudentName())
                .trainerName(trainer.getUserName())
                .courseName(course != null ? course.getCourseName() : null)
                .attendanceDate(date)
                .attendanceStatus(att.getAttendanceStatus())
                .build();
    }

    public List<Attendance> getAll() {
        User trainer = getTrainer();
        return attendanceRepo.findByTrainer(trainer.getUserId());
    }

    public Attendance update(Long studentId, AttendanceStatus status) {
        Attendance att = attendanceRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Not found"));

        att.setAttendanceStatus(status);
        return attendanceRepo.save(att);
    }

    public String delete(Long studentId) {
        attendanceRepo.deleteById(studentId);
        return "Deleted";
    }
}