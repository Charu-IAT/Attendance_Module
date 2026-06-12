// ─── Student Types ────────────────────────────────────────────────────────────

export type Gender = 'Male' | 'Female' | 'Other';

export type AttendanceStatus = 'Present' | 'Absent' | 'Abscond';

/** A student record returned by the backend REST API. */
export interface StudentDTO {
  studentId: number;
  studentName: string;
  email: string;
  studentGender: Gender;
  studentDob: string;        
  courseName: string;
  courseDuration: number;
  studentQualification: string;
  address: string;
}

/**
 * A student record stored locally (localStorage).
 * Uses shorter field names to match the existing localStorage schema.
 */
export interface LocalStudent {
  id: number;
  name: string;
  email: string;
  gender: string;
  dob: string;
  course: string;
  duration: string;
  address: string;
  qualification: string;
  trainerEmail: string;
}

/** Form data for adding / editing a local student (no id). */
export type StudentFormData = Omit<LocalStudent, 'id'>;

/**
 * Request body for POST /student/addStudent.
 * courseId references the course by its numeric ID.
 */
export interface StudentPayload {
  studentName: string;
  email: string;
  studentGender: Gender;
  studentDob: string;         // ISO date, e.g. "2004-06-10"
  studentQualification: string;
  address: string;
  courseId: number;
  trainerId: number;
}

/** A single row in the attendance table. */
export interface AttendanceRecord {
  id: number;
  studentName: string;
  courseName: string;
  trainerName: string;
  attendanceDate: string;
  status: AttendanceStatus;
}
