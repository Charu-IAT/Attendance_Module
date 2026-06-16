import { useState, useEffect, useCallback } from 'react';
import { FiEye, FiX, FiRefreshCw } from 'react-icons/fi';
import type { StudentDTO } from '../../types/student.types';
import { getStudentsByTrainer, getStudentsByCourse, viewAllUsers } from '../../api/services';
import type { AxiosError } from 'axios';
import Pagination from '../../components/Pagination';
import { getUserId, getUserName, setUserId } from '../../hooks/useAuth';

type ModalMode = 'view' | null;

export default function StudentDetails() {
  const trainerName = getUserName();

  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeStudent, setActiveStudent] = useState<StudentDTO | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ── resolve userId then fetch trainer's students ─────────────────────────────
  // The backend login response may not include userId, so we resolve it on-demand
  // by matching the logged-in userName against GET /user/viewUser.
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      let resolvedId = getUserId();
      let trainerCourseName: string | null = null;

      if (resolvedId === null) {
        // Resolve userId from the full user list by matching userName
        try {
          const usersRes = await viewAllUsers();
          const match = usersRes.data.find((u) => u.userName === trainerName);
          if (match) {
            resolvedId = match.userId;
            trainerCourseName = match.courseName;
            setUserId(resolvedId); // cache for future page loads
          }
        } catch (err) {
          console.warn('Non-fatal: Could not resolve trainer ID from user list:', err);
        }
      }

      try {
        const res = await getStudentsByTrainer(resolvedId);
        setStudents(res.data);
      } catch (err) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 400 || axiosErr.response?.status === 404) {
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
              setStudents(fallbackRes.data);
            } catch (fbErr) {
              console.warn('Non-fatal: Fallback course fetch failed:', fbErr);
              setStudents([]);
            }
          } else {
            setStudents([]);
          }
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [trainerName]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ── modal helpers ───────────────────────────────────────────────────────────
  const openView = (student: StudentDTO) => {
    setActiveStudent(student);
    setModalMode('view');
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveStudent(null);
  };

  // Pagination calculations
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = students.slice(startIndex, startIndex + itemsPerPage);

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <main className="trainer-page student-details-page">
      {/* Heading */}
      <section className="trainer-heading student-heading">
        <div>
          <h1>My Students</h1>
          <p>
            Students assigned to <strong>{trainerName}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="student-count-badge">
            {students.length} student{students.length !== 1 ? 's' : ''}
          </div>
          <button
            className="icon-btn view"
            onClick={fetchStudents}
            disabled={loading}
            title="Refresh"
            aria-label="Refresh students"
          >
            <FiRefreshCw className={loading ? 'spin' : ''} />
          </button>
        </div>
      </section>

      {/* Table */}
      <section className="panel table-panel scrollable-table-panel">
        {loading ? (
          <div className="loading-state">
            <FiRefreshCw className="spin" />
            <span>Loading students…</span>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="add-btn" onClick={fetchStudents}>Retry</button>
          </div>
        ) : (
          <>
            <div className="table-scroll-wrapper">
              <table className="custom-table trainer-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>DOB</th>
                    <th>Course</th>
                    <th>Qualification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty-table-cell">
                        <div className="empty-state-block">
                          <span className="empty-state-icon">👥</span>
                          <p>No students assigned to you yet.</p>
                          <span>Contact your admin to assign students.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student, index) => (
                      <tr key={student.studentId}>
                        <td className="row-num">{startIndex + index + 1}</td>
                        <td>{student.studentName}</td>
                        <td className="text-muted">{student.email}</td>
                        <td>{student.studentGender}</td>
                        <td className="text-muted">{student.studentDob}</td>
                        <td>
                          <span className="course-pill">{student.courseName}</span>
                        </td>
                        <td>{student.studentQualification}</td>
                        <td>
                          <div className="action-cell">
                            <button
                              className="icon-btn view"
                              aria-label={`View ${student.studentName}`}
                              title="View details"
                              onClick={() => openView(student)}
                            >
                              <FiEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={students.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(size) => {
                setItemsPerPage(size);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </section>

      {/* View Modal */}
      {modalMode === 'view' && activeStudent && (
        <div className="modal-overlay">
          <div className="modal-box student-modal">
            <div className="modal-header">
              <h2>Student Details</h2>
              <button type="button" className="close-btn" onClick={closeModal} aria-label="Close">
                <FiX />
              </button>
            </div>
            <div className="modal-body student-form-grid">
              {(
                [
                  ['Name',           activeStudent.studentName],
                  ['Email',          activeStudent.email],
                  ['Gender',         activeStudent.studentGender],
                  ['Date of Birth',  activeStudent.studentDob],
                  ['Course',         activeStudent.courseName],
                  ['Duration',       `${activeStudent.courseDuration} ${activeStudent.courseDuration === 1 ? 'month' : 'months'}`],
                  ['Join Date',      activeStudent.createdDate],
                  ['Qualification',  activeStudent.studentQualification],
                  ['Address',        activeStudent.address],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div className="form-group" key={label}>
                  <label>{label}</label>
                  <input type="text" value={value || '—'} disabled readOnly />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
