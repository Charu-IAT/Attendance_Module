// ─── Attendance Types ─────────────────────────────────────────────────────────

/** Valid attendance status values accepted by the backend. */
export type AttendanceStatus = 'Present' | 'Absent' | 'Abscont';

// ─── Response DTOs ────────────────────────────────────────────────────────────

/**
 * A full attendance record returned by PUT endpoints
 * (update by attendanceId / by-student-id / by-student-name).
 */
export interface AttendanceDTO {
  attendanceId: number;
  studentId: number;
  trainerUserId: number;
  courseId: number;
  attendanceDate: string;       // "YYYY-MM-DD"
  attendanceStatus: AttendanceStatus;
  trainerName: string | null;
}

/**
 * A summary attendance row returned by GET /attendance and
 * GET /attendance/by-date — includes resolved names rather than IDs.
 */
export interface AttendanceSummaryDTO {
  attendanceId: number;
  studentName: string;
  trainerName: string;
  courseName: string;
  attendanceDate: string;       // "YYYY-MM-DD"
  attendanceStatus: AttendanceStatus;
}

/**
 * Dashboard stats returned by GET /attendance/admin-dashboard.
 */
export interface AdminDashboardDTO {
  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  totalOngoing: number;
}

/**
 * Dashboard stats returned by GET /attendance/trainer-dashboard.
 * Includes trainer identity fields in addition to the counts.
 */
export interface TrainerDashboardDTO {
  trainerId: number;
  trainerName: string;
  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  totalOngoing: number;
}

// ─── Request Payloads ─────────────────────────────────────────────────────────

/**
 * Request body for POST /attendance/by-name.
 * Used by trainers to mark attendance by student name.
 */
export interface AttendanceByNamePayload {
  studentId: number;
  studentName: string;
  attendanceDate: string;       
  attendanceStatus: AttendanceStatus;
}
