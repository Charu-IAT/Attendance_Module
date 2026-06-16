import type { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import type {
  AuthResponse,
  LoginPayload,
  UpdateUserPayload,
  UserDTO,
  UserRequestPayload,
  ForgotPasswordPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
} from '../types/user.types';
import type { LogoutResponse } from '../types/logout.types';
import type { StudentDTO, StudentPayload } from '../types/student.types';
import type { CourseDTO, CoursePayload } from '../types/course.types';
import type {
  AdminDashboardDTO,
  AttendanceByNamePayload,
  AttendanceDTO,
  AttendanceSummaryDTO,
  AttendanceStatus,
  TrainerDashboardDTO,
} from '../types/attendance.types';

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Authenticate a user and receive a JWT token.
 * POST /api/auth/login
 */
export const loginUser = (
  data: LoginPayload,
): Promise<AxiosResponse<AuthResponse>> =>
  axiosInstance.post('/api/auth/login', data);

/**
 * Register a new user account.
 * POST /api/auth/register
 */
export const registerUser = (
  data: UserRequestPayload,
): Promise<AxiosResponse<UserDTO>> =>
  axiosInstance.post('/api/auth/register', data);

/**
 * Logout the authenticated user.
 * POST /api/auth/logout
 */
export const logoutUser = (): Promise<AxiosResponse<LogoutResponse>> =>
  axiosInstance.post('/api/auth/logout');

/**
 * Request password reset OTP.
 * POST /api/auth/forgot-password
 */
export const forgotPassword = (
  data: ForgotPasswordPayload,
): Promise<AxiosResponse<{ message: string }>> =>
  axiosInstance.post('/api/auth/forgot-password', data);

/**
 * Verify OTP.
 * POST /api/auth/verify-otp
 */
export const verifyOtp = (
  data: VerifyOtpPayload,
): Promise<AxiosResponse<{ message: string }>> =>
  axiosInstance.post('/api/auth/verify-otp', data);

/**
 * Reset password using OTP.
 * POST /api/auth/reset-password
 */
export const resetPassword = (
  data: ResetPasswordPayload,
): Promise<AxiosResponse<{ message: string }>> =>
  axiosInstance.post('/api/auth/reset-password', data);

// ─── User ─────────────────────────────────────────────────────────────────────

/**
 * Fetch all users regardless of role.
 * GET /user/viewUser
 */
export const viewAllUsers = (): Promise<AxiosResponse<UserDTO[]>> =>
  axiosInstance.get('/user/viewUser');

/**
 * Fetch users filtered by role ID.
 * GET /user/viewUser/:roleId
 */
export const viewUsersByRole = (
  roleId: number,
): Promise<AxiosResponse<UserDTO[]>> =>
  axiosInstance.get(`/user/viewUser/${roleId}`);

/**
 * Fetch users assigned to a specific course.
 * GET /user/userbycourName/:courseName
 */
export const viewUsersByCourseName = (
  courseName: string,
): Promise<AxiosResponse<UserDTO[]>> =>
  axiosInstance.get(
    `/user/userbycourName/${encodeURIComponent(courseName)}`,
  );

/**
 * Update a user's details.
 * PUT /user/updateUser/:userId
 */
export const updateUser = (
  userId: number,
  data: UpdateUserPayload,
): Promise<AxiosResponse<UserDTO>> =>
  axiosInstance.put(`/user/updateUser/${userId}`, data);

/**
 * Delete a user by their ID.
 * DELETE /user/deleteUser/:userId
 */
export const deleteUser = (
  userId: number,
): Promise<AxiosResponse<string>> =>
  axiosInstance.delete(`/user/deleteUser/${userId}`);

// ─── Student ──────────────────────────────────────────────────────────────────

/**
 * Fetch all students (admin view).
 * GET /student/getStudent
 */
export const getAllStudents = (): Promise<AxiosResponse<StudentDTO[]>> =>
  axiosInstance.get('/student/getStudent');

/**
 * Fetch a single student by their ID.
 * GET /student/getStudent/:studentId
 */
export const getStudentById = (
  studentId: number,
): Promise<AxiosResponse<StudentDTO[]>> =>
  axiosInstance.get(`/student/getStudent/${studentId}`);

/**
 * Fetch students belonging to a trainer.
 * GET /student/trainer/students
 */
export const getStudentsByTrainer = (
  trainerUserId?: number,
): Promise<AxiosResponse<StudentDTO[]>> =>
  axiosInstance.get('/student/trainer/students');

/**
 * Fetch students filtered by gender.
 * GET /student/getStudent/gender/:studentGender
 */
export const getStudentsByGender = (
  studentGender: string,
): Promise<AxiosResponse<StudentDTO[]>> =>
  axiosInstance.get(
    `/student/getStudent/gender/${encodeURIComponent(studentGender)}`,
  );

/**
 * Fetch students enrolled in a specific course.
 * GET /student/getStudent/course/:course
 */
export const getStudentsByCourse = (
  course: string,
): Promise<AxiosResponse<StudentDTO[]>> =>
  axiosInstance.get(
    `/student/getStudent/course/${encodeURIComponent(course)}`,
  );

/**
 * Register a new student.
 * POST /student/addStudent
 */
export const addStudent = (
  data: StudentPayload,
): Promise<AxiosResponse<StudentDTO>> =>
  axiosInstance.post('/student/addStudent', data);

/**
 * Delete a student by their ID.
 * DELETE /student/delete/{studentId}
 */
export const deleteStudent = (
  studentId: number,
): Promise<AxiosResponse<string>> =>
  axiosInstance.delete(`/student/delete/${studentId}`);

/**
 * Update a student's details.
 * PUT /student/update/:studentId
 */
export const updateStudent = (
  studentId: number,
  data: StudentPayload,
): Promise<AxiosResponse<StudentDTO>> =>
  axiosInstance.put(`/student/update/${studentId}`, data);

// ─── Course ──────────────────────────────────────────────────────────────────

/**
 * Fetch all courses.
 * GET /course/viewcourse
 */
export const getAllCourses = (): Promise<AxiosResponse<CourseDTO[]>> =>
  axiosInstance.get('/course/viewcourse');

/**
 * Create a new course.
 * POST /course/addcourse
 */
export const addCourse = (
  data: CoursePayload,
): Promise<AxiosResponse<CourseDTO>> =>
  axiosInstance.post('/course/addcourse', data);

/**
 * Update an existing course.
 * PUT /course/getcourse/:courseId
 */
export const updateCourse = (
  courseId: number,
  data: CoursePayload,
): Promise<AxiosResponse<CourseDTO>> =>
  axiosInstance.put(`/course/getcourse/${courseId}`, data);

/**
 * Delete a course by its ID.
 * DELETE /course/delete/:courseId
 */
export const deleteCourse = (
  courseId: number,
): Promise<AxiosResponse<string>> =>
  axiosInstance.delete(`/course/delete/${courseId}`);

// ─── Attendance ───────────────────────────────────────────────────────────────

/**
 * Fetch all attendance records (admin view).
 * GET /attendance
 */
export const getAllAttendance = (): Promise<AxiosResponse<AttendanceSummaryDTO[]>> =>
  axiosInstance.get('/attendance');

/**
 * Fetch attendance records filtered by a specific date.
 * GET /attendance/by-date?date={date}
 */
export const getAttendanceByDate = (
  date: string,
): Promise<AxiosResponse<AttendanceSummaryDTO[]>> =>
  axiosInstance.get('/attendance/by-date', { params: { date } });

/**
 * Fetch the admin-level attendance dashboard summary for a given date.
 * GET /attendance/admin-dashboard?date={date}
 */
export const getAdminDashboard = (
  date?: string,
): Promise<AxiosResponse<AdminDashboardDTO>> =>
  axiosInstance.get('/attendance/admin-dashboard', { params: date ? { date } : undefined });

/**
 * Fetch the trainer-level attendance dashboard summary for a given date.
 * GET /attendance/trainer-dashboard?date={date}
 */
export const getTrainerDashboard = (
  date?: string,
): Promise<AxiosResponse<TrainerDashboardDTO>> =>
  axiosInstance.get('/attendance/trainer-dashboard', { params: date ? { date } : undefined });

/**
 * Mark / update attendance by attendance record ID.
 * PUT /attendance/{attendanceId}?status={status}
 */
export const updateAttendanceById = (
  attendanceId: number,
  status: AttendanceStatus,
): Promise<AxiosResponse<AttendanceDTO>> =>
  axiosInstance.put(`/attendance/${attendanceId}`, null, { params: { status } });

/**
 * Mark / update attendance by student name and date.
 * PUT /attendance/by-student-name/{studentName}?date={date}&status={status}
 */
export const updateAttendanceByStudentName = (
  studentName: string,
  date: string,
  status: AttendanceStatus,
): Promise<AxiosResponse<AttendanceDTO>> =>
  axiosInstance.put(
    `/attendance/by-student-name/${encodeURIComponent(studentName)}`,
    null,
    { params: { date, status } },
  );

/**
 * Mark / update attendance by student ID and date.
 * PUT /attendance/by-student-id/{studentId}?date={date}&status={status}
 */
export const updateAttendanceByStudentId = (
  studentId: number,
  date: string,
  status: AttendanceStatus,
): Promise<AxiosResponse<AttendanceDTO>> =>
  axiosInstance.put(
    `/attendance/by-student-id/${studentId}`,
    null,
    { params: { date, status } },
  );

/**
 * Create an attendance record using the student's name.
 * POST /attendance/by-name
 *
 * Returns a summary DTO with resolved names (studentName, trainerName,
 * courseName) rather than raw IDs.
 */
export const createAttendanceByName = (
  data: AttendanceByNamePayload,
): Promise<AxiosResponse<AttendanceSummaryDTO>> =>
  axiosInstance.post('/attendance/by-name', data);

/**
 * Delete an attendance record by its ID.
 * DELETE /attendance/{attendanceId}
 */
export const deleteAttendance = (
  attendanceId: number,
): Promise<AxiosResponse<string>> =>
  axiosInstance.delete(`/attendance/${attendanceId}`);

// ─── Reports ──────────────────────────────────────────────────────────────────

/**
 * Download Monthly Daily Attendance Report as PDF or Excel.
 * GET /api/reports/monthly-daily
 */
export const downloadMonthlyDailyReport = (
  month: number,
  year: number,
  format: 'pdf' | 'excel',
  courseId?: number,
): Promise<AxiosResponse<Blob>> =>
  axiosInstance.get('/api/reports/monthly-daily', {
    params: { month, year, format, courseId },
    responseType: 'blob',
  });

/**
 * Download Course-wise Attendance Report as PDF or Excel.
 * GET /api/reports/course-wise
 */
export const downloadCourseWiseReport = (
  format: 'pdf' | 'excel',
  courseId?: number,
  startDate?: string,
  endDate?: string,
): Promise<AxiosResponse<Blob>> =>
  axiosInstance.get('/api/reports/course-wise', {
    params: { format, courseId, startDate, endDate },
    responseType: 'blob',
  });

/**
 * Download Student-wise Attendance Report as PDF or Excel.
 * GET /api/reports/student-wise
 */
export const downloadStudentWiseReport = (
  studentId: number,
  format: 'pdf' | 'excel',
  startDate?: string,
  endDate?: string,
): Promise<AxiosResponse<Blob>> =>
  axiosInstance.get('/api/reports/student-wise', {
    params: { studentId, format, startDate, endDate },
    responseType: 'blob',
  });


