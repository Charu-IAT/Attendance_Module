import { useState, useEffect, useCallback } from 'react';
import { FiCalendar, FiRefreshCw, FiSave, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import type { StudentDTO } from '../../types/student.types';
import type { AttendanceSummaryDTO, AttendanceStatus } from '../../types/attendance.types';
import {
  getStudentsByTrainer,
  getStudentsByCourse,
  createAttendanceByName,
  getAttendanceByDate,
  updateAttendanceByStudentId,
  updateAttendanceByStudentName,
  viewAllUsers,
} from '../../api/services';
import { getUserId, getUserName, setUserId } from '../../hooks/useAuth';
import type { AxiosError } from 'axios';
import { useToast } from '../../hooks/useToast';
import Pagination from '../../components/Pagination';

// ─── Per-row working state ────────────────────────────────────────────────────

interface AttendanceRow {
  student: StudentDTO;
  /** Status currently selected in the UI dropdown */
  status: AttendanceStatus;
  /** The attendanceId returned by the backend (set after first save) */
  attendanceId: number | null;
  /** Whether this row has been saved successfully */
  saved: boolean;
  /** Per-row saving spinner */
  saving: boolean;
  /** Per-row error message */
  error: string | null;
}

const today = new Date().toISOString().split('T')[0];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AttendanceManagement() {
  const trainerName = getUserName();

  // ── state ──────────────────────────────────────────────────────────────────
  const [date, setDate] = useState<string>(today);
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bulkSaving, setBulkSaving] = useState(false);

  const toast = useToast();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ── Build rows from students + existing attendance for the date ────────────
  const buildRows = useCallback(
    (students: StudentDTO[], existing: AttendanceSummaryDTO[]): AttendanceRow[] =>
      students.map((student) => {
        const record = existing.find((r) => r.studentName === student.studentName);
        return {
          student,
          status: (record?.attendanceStatus ?? 'No Record') as AttendanceStatus,
          attendanceId: record?.attendanceId ?? null,
          saved: !!record,
          saving: false,
          error: null,
        };
      }),
    [],
  );

  // ── Resolve userId (self-healing) then fetch students + attendance ──────────
  // The backend login response may not return userId, so we resolve it on-demand.
  const fetchData = useCallback(
    async (selectedDate: string) => {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      try {
        let resolvedId = getUserId();
        let trainerCourseName: string | null = null;

        if (resolvedId === null) {
          try {
            const usersRes = await viewAllUsers();
            const match = usersRes.data.find((u) => u.userName === trainerName);
            if (match) {
              resolvedId = match.userId;
              trainerCourseName = match.courseName;
              setUserId(resolvedId);
            }
          } catch (err) {
            console.warn('Non-fatal: Could not resolve trainer ID from user list:', err);
          }
        }

        let studentsData: StudentDTO[] = [];
        let attendanceData: AttendanceSummaryDTO[] = [];

        try {
          const [studentsRes, attendanceRes] = await Promise.all([
            getStudentsByTrainer(resolvedId),
            getAttendanceByDate(selectedDate),
          ]);
          studentsData = studentsRes.data;
          attendanceData = attendanceRes.data;
        } catch (err) {
          const axiosErr = err as AxiosError;
          if (axiosErr.response?.status === 400 || axiosErr.response?.status === 404) {
            // Try course fallback
            if (!trainerCourseName) {
              try {
                const usersRes = await viewAllUsers();
                const match = usersRes.data.find((u) => u.userName === trainerName);
                trainerCourseName = match?.courseName ?? null;
              } catch (uErr) {
                console.warn('Non-fatal: Could not resolve trainer course from user list:', uErr);
              }
            }
            if (trainerCourseName) {
              try {
                const fallbackRes = await getStudentsByCourse(trainerCourseName);
                studentsData = fallbackRes.data;
              } catch (fbErr) {
                console.warn('Non-fatal: Fallback course fetch failed:', fbErr);
                studentsData = [];
              }
            } else {
              studentsData = [];
            }
            // we still want to keep attendanceData as whatever we successfully fetched or empty
          } else {
            throw err;
          }
        }

        const activeStudents = studentsData.filter(
          (student) => !student.createdDate || student.createdDate <= selectedDate
        );
        setRows(buildRows(activeStudents, attendanceData));
      } catch (err) {
        console.error('Failed to load attendance data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [trainerName, buildRows],
  );

  useEffect(() => {
    fetchData(date);
  }, [fetchData, date]);

  // ── Status change in dropdown ──────────────────────────────────────────────
  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setRows((prev) =>
      prev.map((r) =>
        r.student.studentId === studentId
          ? { ...r, status, saved: false, error: null }
          : r,
      ),
    );
  };

  // ── Save a single row ──────────────────────────────────────────────────────
  const saveRow = async (row: AttendanceRow): Promise<void> => {
    if (row.status === 'No Record') return;
    // Mark this row as saving
    setRows((prev) =>
      prev.map((r) =>
        r.student.studentId === row.student.studentId
          ? { ...r, saving: true, error: null }
          : r,
      ),
    );

    try {
      let attendanceId = row.attendanceId;

      if (attendanceId !== null) {
        // Record already exists — update by student name
        // PUT /attendance/by-student-name/{studentName}?date=&status=
        await updateAttendanceByStudentName(row.student.studentName, date, row.status);
      } else {
        // No record yet — create via POST /attendance/by-name
        const res = await createAttendanceByName({
          studentId: row.student.studentId,
          studentName: row.student.studentName,
          attendanceDate: date,
          attendanceStatus: row.status,
        });
        attendanceId = res.data.attendanceId;
      }

      setRows((prev) =>
        prev.map((r) =>
          r.student.studentId === row.student.studentId
            ? { ...r, saving: false, saved: true, attendanceId, error: null }
            : r,
        ),
      );
    } catch (err) {
      console.error('Failed to save attendance:', err);
      setRows((prev) =>
        prev.map((r) =>
          r.student.studentId === row.student.studentId
            ? { ...r, saving: false, error: 'Save failed. Try again.' }
            : r,
        ),
      );
    }
  };

  // ── Save ALL rows at once ──────────────────────────────────────────────────
  const handleSaveAll = async () => {
    const rowsToSave = rows.filter((r) => r.status !== 'No Record' && !r.saved);
    if (rowsToSave.length === 0) {
      toast.error('No changes to save.');
      return;
    }

    setBulkSaving(true);
    try {
      await Promise.all(rowsToSave.map((row) => saveRow(row)));
      toast.success('Attendance saved successfully!');
    } catch (err) {
      toast.error('Failed to save some attendance records. Please try again.');
    } finally {
      setBulkSaving(false);
    }
  };

  // ── Reset to today ─────────────────────────────────────────────────────────
  const handleReset = () => {
    setDate(today);
    fetchData(today);
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalPresent = rows.filter((r) => r.status === 'Present').length;
  const totalAbsent = rows.filter((r) => r.status === 'Absent').length;
  const totalAbscont = rows.filter((r) => r.status === 'Abscont').length;

  // ── Course info ────────────────────────────────────────────────────────────
  const assignedCourses = [...new Set(rows.map((r) => r.student.courseName))].join(', ');

  // Pagination calculations
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedRows = rows.slice(startIndex, startIndex + itemsPerPage);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <main className="trainer-page attendance-page">
      {/* Heading */}
      <section className="trainer-heading">
        <h1>Attendance Management</h1>
        <p>
          Managing attendance for: <strong>{trainerName}</strong>
        </p>
      </section>

      {/* Filter Card */}
      <section className="attendance-filter-card">
        {assignedCourses && (
          <div className="assigned-course-alert">
            <strong>Your Assigned Courses:</strong> {assignedCourses}
            <p>You can only view and manage attendance for your assigned students.</p>
          </div>
        )}

        <div className="attendance-filters">
          {/* Date picker */}
          <div className="form-group">
            <label htmlFor="att-date">
              <FiCalendar /> Attendance Date
            </label>
            <input
              id="att-date"
              type="date"
              name="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Quick stats */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
            <span style={{ background: '#dcfce7', color: '#007a38', padding: '6px 14px', borderRadius: '999px', fontWeight: 700, fontSize: '15px' }}>
              ✓ Present: {totalPresent}
            </span>
            <span style={{ background: '#fee2e2', color: '#c50000', padding: '6px 14px', borderRadius: '999px', fontWeight: 700, fontSize: '15px' }}>
              ✗ Absent: {totalAbsent}
            </span>
            {totalAbscont > 0 && (
              <span style={{ background: '#fef9c3', color: '#854d0e', padding: '6px 14px', borderRadius: '999px', fontWeight: 700, fontSize: '15px' }}>
                ~ Abscont: {totalAbscont}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="panel table-panel attendance-table-panel">
        {loading ? (
          <div className="loading-state">
            <FiRefreshCw className="spin" />
            <span>Loading students…</span>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="add-btn" onClick={() => fetchData(date)}>Retry</button>
          </div>
        ) : (
          <>
            <div className="table-scroll-wrapper">
              <table className="custom-table trainer-table attendance-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Attendance Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', opacity: 0.6 }}>
                        No students assigned to you.
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row, index) => (
                      <tr key={row.student.studentId}>
                        <td>{startIndex + index + 1}</td>
                        <td>{row.student.studentName}</td>
                        <td>
                          <span className="course-pill">{row.student.courseName}</span>
                        </td>
                        <td>{date}</td>
                        <td>
                          <select
                            className={`status-select ${row.status.toLowerCase().replace(/\s+/g, '')}`}
                            value={row.status}
                            disabled={row.saving}
                            onChange={(e) =>
                              handleStatusChange(
                                row.student.studentId,
                                e.target.value as AttendanceStatus,
                              )
                            }
                          >
                            {row.attendanceId === null && (
                              <option value="No Record" disabled hidden>No Record</option>
                            )}
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Abscont">Abscont</option>
                          </select>
                        </td>
                        <td>
                          {row.saving ? (
                            <FiRefreshCw className="spin" style={{ fontSize: '20px', color: '#64748b' }} />
                          ) : row.error ? (
                            <span style={{ color: '#c50000', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FiAlertCircle /> {row.error}
                            </span>
                          ) : row.saved ? (
                            <span style={{ color: '#007a38', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FiCheckCircle /> Saved
                            </span>
                          ) : (
                            <button
                              className="icon-btn edit"
                              title="Save this row"
                              aria-label={`Save attendance for ${row.student.studentName}`}
                              onClick={() => saveRow(row)}
                            >
                              <FiSave />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={activePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={rows.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(size) => {
                setItemsPerPage(size);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </section>

      {/* Actions */}
      <div className="attendance-actions">
        <button
          className="save-attendance-btn"
          onClick={handleSaveAll}
          disabled={bulkSaving || loading || rows.length === 0}
        >
          {bulkSaving ? <FiRefreshCw className="spin" /> : <FiSave />}
          {bulkSaving ? 'Saving…' : 'Save All Attendance'}
        </button>

        <button className="reset-attendance-btn" onClick={handleReset} disabled={bulkSaving}>
          <FiRefreshCw />
          Reset to Today
        </button>
      </div>
    </main>
  );
}
