import { useState, useEffect, useCallback } from 'react';
import { FiEdit2, FiEye, FiPlus, FiTrash2, FiX, FiRefreshCw } from 'react-icons/fi';
import type { StudentDTO, StudentPayload, Gender } from '../../types/student.types';
import type { CourseDTO } from '../../types/course.types';
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getAllCourses,
  viewUsersByRole,
} from '../../api/services';
import type { UserDTO } from '../../types/user.types';
import { useToast } from '../../hooks/useToast';
import Pagination from '../../components/Pagination';
import type { AxiosError } from 'axios';
import { confirmDelete } from '../../utils/alert';
import { validateEmail } from '../../utils/validation';

// ─── Form shape (matches StudentPayload + view helpers) ───────────────────────

interface StudentFormData {
  studentName: string;
  email: string;
  studentGender: Gender | '';
  studentDob: string;
  studentQualification: string;
  address: string;
  courseId: number | '';
  trainerId: number | '';
  createdDate: string;
}

const today = new Date().toISOString().split('T')[0];

const emptyForm: StudentFormData = {
  studentName: '',
  email: '',
  studentGender: '',
  studentDob: '',
  studentQualification: '',
  address: '',
  courseId: '',
  trainerId: '',
  createdDate: today,
};

type ModalMode = 'add' | 'edit' | 'view' | null;

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudentDetails() {
  // ── data state ───────────────────────────────────────────────────────────────
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [trainers, setTrainers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const toast = useToast();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(students.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ── modal state ──────────────────────────────────────────────────────────────
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [viewStudent, setViewStudent] = useState<StudentDTO | null>(null);
  const [formData, setFormData] = useState<StudentFormData>(emptyForm);

  // ── fetch students + courses in parallel ─────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const [studentsRes, coursesRes, trainersRes] = await Promise.all([
        getAllStudents(),
        getAllCourses(),
        viewUsersByRole(2), // 2 is Trainer role
      ]);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setTrainers(trainersRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── modal helpers ────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setFormData(emptyForm);
    setViewStudent(null);
    setModalMode('add');
  };

  const openViewModal = (student: StudentDTO) => {
    setViewStudent(student);
    setModalMode('view');
  };

  const openEditModal = (student: StudentDTO) => {
    const matchedCourse = courses.find((c) => c.courseName === student.courseName);

    setFormData({
      studentName: student.studentName,
      email: student.email,
      studentGender: student.studentGender,
      studentDob: student.studentDob,
      studentQualification: student.studentQualification,
      address: student.address,
      courseId: matchedCourse?.courseId ?? '',
      trainerId: student.userId ?? '',
      createdDate: student.createdDate || today,
    });
    setSelectedStudentId(student.studentId);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setViewStudent(null);
    setSelectedStudentId(null);
    setFormData(emptyForm);
  };

  // ── form handler ─────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── POST /student/addStudent ─────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.studentName.trim() ||
      !formData.email.trim() ||
      !formData.studentGender ||
      !formData.studentDob ||
      !formData.studentQualification.trim() ||
      !formData.address.trim() ||
      formData.courseId === '' ||
      formData.trainerId === '' ||
      !formData.createdDate
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (formData.studentName.trim().length > 20) {
      toast.error('Student Name must be at most 20 characters.');
      return;
    }

    const emailTrimmed = formData.email.trim();
    if (!validateEmail(emailTrimmed)) {
      toast.error('Email cannot accept emojis or special symbols.');
      return;
    }

    // Validate Join Date (createdDate)
    const [joinYear, joinMonth, joinDay] = formData.createdDate.split('-').map(Number);
    const [todayYear, todayMonth, todayDay] = today.split('-').map(Number);

    const joinDate = new Date(joinYear, joinMonth - 1, joinDay);
    const todayDate = new Date(todayYear, todayMonth - 1, todayDay);

    if (joinDate > todayDate) {
      toast.error('Join date cannot be in the future.');
      return;
    }

    const minJoinDate = new Date(todayYear, todayMonth - 1, todayDay);
    minJoinDate.setMonth(minJoinDate.getMonth() - 1);

    if (joinDate < minJoinDate) {
      toast.error('Join date can be in the past only within 1 month.');
      return;
    }

    const payload: StudentPayload = {
      studentName: formData.studentName.trim(),
      email: formData.email.trim(),
      studentGender: formData.studentGender as Gender,
      studentDob: formData.studentDob,
      studentQualification: formData.studentQualification.trim(),
      address: formData.address.trim(),
      courseId: Number(formData.courseId),
      trainerId: Number(formData.trainerId),
      createdDate: formData.createdDate || today,
    };

    setSaving(true);
    try {
      if (modalMode === 'edit' && selectedStudentId !== null) {
        const res = await updateStudent(selectedStudentId, payload);
        setStudents((prev) =>
          prev.map((s) => (s.studentId === selectedStudentId ? res.data : s)),
        );
        toast.success('Student updated successfully!');
      } else {
        const res = await addStudent(payload);
        setStudents((prev) => [...prev, res.data]);
        toast.success('Student added successfully!');
      }
      closeModal();
    } catch (err) {
      console.error(`Failed to ${modalMode === 'edit' ? 'update' : 'add'} student:`, err);
      const axiosErr = err as AxiosError<any>;
      const data = axiosErr.response?.data;
      let serverMsg = axiosErr.message || `Failed to ${modalMode === 'edit' ? 'update' : 'add'} student. Please try again.`;
      
      if (data && typeof data === 'object') {
        if (typeof data.message === 'string') {
          serverMsg = data.message;
        } else if (typeof data.error === 'string') {
          serverMsg = data.error;
        } else if (Array.isArray(data.errors) && data.errors.length > 0 && data.errors[0]?.defaultMessage) {
          serverMsg = data.errors[0].defaultMessage;
        } else {
          const values = Object.values(data);
          if (values.length > 0 && typeof values[0] === 'string') {
            serverMsg = values[0];
          }
        }
      }
      toast.error(serverMsg);
    } finally {
      setSaving(false);
    }
  };

  // ── DELETE /student/delete/{studentId} ───────────────────────────────────────
  const handleDelete = async (student: StudentDTO) => {
    const result = await confirmDelete(
      'Delete student?',
      `Delete "${student.studentName}"? This cannot be undone.`
    );
    if (!result.isConfirmed) return;

    setDeleting(student.studentId);
    try {
      await deleteStudent(student.studentId);
      setStudents((prev) => prev.filter((s) => s.studentId !== student.studentId));
      toast.success(`Student "${student.studentName}" deleted successfully!`);
    } catch (err) {
      console.error('Failed to delete student:', err);
      toast.error('Failed to delete student. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // Pagination calculations
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedStudents = students.slice(startIndex, startIndex + itemsPerPage);

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <main className="admin-page">
      {/* Page heading */}
      <section className="page-heading student-heading">
        <div>
          <h2>Student Details</h2>
          <p>Manage student information</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="icon-btn view"
            onClick={fetchData}
            disabled={loading}
            aria-label="Refresh students"
            title="Refresh"
          >
            <FiRefreshCw className={loading ? 'spin' : ''} />
          </button>
          <button className="add-btn" id="add-student-btn" onClick={openAddModal}>
            <FiPlus />
            Add Student
          </button>
        </div>
      </section>

      {/* Table panel */}
      <section className="panel table-panel scrollable-table-panel">
        {loading && (
          <div className="loading-state">
            <FiRefreshCw className="spin" />
            <span>Loading students…</span>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <p>{error}</p>
            <button className="add-btn" onClick={fetchData}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="table-scroll-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>DOB</th>
                    <th>Course</th>
                    <th>Trainer</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', opacity: 0.6 }}>
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student, index) => (
                      <tr key={student.studentId}>
                        <td>{startIndex + index + 1}</td>
                        <td>{student.studentName}</td>
                        <td className="email-cell" title={student.email}>{student.email}</td>
                        <td>{student.studentGender}</td>
                        <td>{student.studentDob}</td>
                        <td>
                          <span className="course-pill">{student.courseName}</span>
                        </td>
                        <td>{student.trainerName || '—'}</td>
                        <td>
                          {student.courseDuration}{' '}
                          {student.courseDuration === 1 ? 'month' : 'months'}
                        </td>
                        <td>
                          <button
                            className="icon-btn view"
                            aria-label={`View ${student.studentName}`}
                            title="View details"
                            onClick={() => openViewModal(student)}
                          >
                            <FiEye />
                          </button>
                          <button
                            className="icon-btn edit"
                            aria-label={`Edit ${student.studentName}`}
                            title="Edit student"
                            onClick={() => openEditModal(student)}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="icon-btn delete"
                            aria-label={`Delete ${student.studentName}`}
                            title="Delete student"
                            disabled={deleting === student.studentId}
                            onClick={() => handleDelete(student)}
                          >
                            <FiTrash2 />
                          </button>
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

      {/* ── Add/Edit Student Modal ── */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="modal-overlay">
          <form
            className="modal-box student-modal"
            onSubmit={handleSave}
            autoComplete="off"
            id="add-student-form"
          >
            <div className="modal-header">
              <h2>{modalMode === 'edit' ? 'Edit Student' : 'Add New Student'}</h2>
              <button
                type="button"
                className="close-btn"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>

            <div className="modal-body student-form-grid">
              {/* Student Name */}
              <div className="form-group">
                <label htmlFor="s-studentName">
                  Student Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="s-studentName"
                  type="text"
                  name="studentName"
                  placeholder="Enter full name"
                  value={formData.studentName}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  maxLength={20}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="s-email">
                  Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="s-email"
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              {/* Gender */}
              <div className="form-group">
                <label htmlFor="s-studentGender">
                  Gender <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="s-studentGender"
                  name="studentGender"
                  value={formData.studentGender}
                  onChange={handleChange}
                  disabled={saving}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className="form-group">
                <label htmlFor="s-studentDob">
                  Date of Birth <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="s-studentDob"
                  type="date"
                  name="studentDob"
                  value={formData.studentDob}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              {/* Course dropdown — populated from the API */}
              <div className="form-group">
                <label htmlFor="s-courseId">
                  Course <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="s-courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  disabled={saving || courses.length === 0}
                  required
                >
                  <option value="">
                    {courses.length === 0 ? 'No courses available' : '— Select a course —'}
                  </option>
                  {courses.map((c) => (
                    <option key={c.courseId} value={c.courseId}>
                      {c.courseName} ({c.courseDuration}{' '}
                      {c.courseDuration === 1 ? 'month' : 'months'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Trainer dropdown — populated from the API */}
              <div className="form-group">
                <label htmlFor="s-trainerId">
                  Assign Trainer <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="s-trainerId"
                  name="trainerId"
                  value={formData.trainerId}
                  onChange={handleChange}
                  disabled={saving || trainers.length === 0}
                  required
                >
                  <option value="">
                    {trainers.length === 0 ? 'No trainers available' : '— Select a trainer —'}
                  </option>
                  {trainers.map((t) => (
                    <option key={t.userId} value={t.userId}>
                      {t.userName} ({t.courseName || 'No course assigned'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Join Date */}
              <div className="form-group">
                <label htmlFor="s-createdDate">
                  Join Date <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="s-createdDate"
                  type="date"
                  name="createdDate"
                  value={formData.createdDate}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              {/* Qualification */}
              <div className="form-group">
                <label htmlFor="s-studentQualification">
                  Qualification <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="s-studentQualification"
                  type="text"
                  name="studentQualification"
                  placeholder="e.g., B.Sc, B.Tech"
                  value={formData.studentQualification}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              {/* Address */}
              <div className="form-group full-width">
                <label htmlFor="s-address">
                  Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  id="s-address"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? 'Saving…' : modalMode === 'edit' ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── View Student Modal ── */}
      {modalMode === 'view' && viewStudent && (
        <div className="modal-overlay">
          <div className="modal-box student-modal">
            <div className="modal-header">
              <h2>Student Details</h2>
              <button
                type="button"
                className="close-btn"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>

            <div className="modal-body student-form-grid">
              <div className="form-group">
                <label>Student Name</label>
                <input type="text" value={viewStudent.studentName} disabled />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="text" value={viewStudent.email} disabled />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <input type="text" value={viewStudent.studentGender} disabled />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="text" value={viewStudent.studentDob} disabled />
              </div>
              <div className="form-group">
                <label>Course</label>
                <input type="text" value={viewStudent.courseName} disabled />
              </div>
              <div className="form-group">
                <label>Course Duration</label>
                <input
                  type="text"
                  value={`${viewStudent.courseDuration} ${viewStudent.courseDuration === 1 ? 'month' : 'months'}`}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Assigned Trainer</label>
                <input type="text" value={viewStudent.trainerName || '—'} disabled />
              </div>
              <div className="form-group">
                <label>Join Date</label>
                <input type="text" value={viewStudent.createdDate || '—'} disabled />
              </div>
              <div className="form-group full-width">
                <label>Qualification</label>
                <input type="text" value={viewStudent.studentQualification} disabled />
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <textarea value={viewStudent.address} disabled />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
