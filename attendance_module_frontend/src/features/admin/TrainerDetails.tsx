import { useState, useEffect, useCallback } from 'react';
import {
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiX,
  FiUser,
  FiMail,
  FiBookOpen,
  FiPlus,
  FiLock,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import type { UserDTO, UpdateUserPayload } from '../../types/user.types';
import type { CourseDTO } from '../../types/course.types';
import { viewUsersByRole, updateUser, deleteUser, registerUser } from '../../api/services';
import { getAllCourses } from '../../api/services';
import { useToast } from '../../hooks/useToast';
import Pagination from '../../components/Pagination';
import type { AxiosError } from 'axios';

// roleId=2 maps to "trainer" on the backend
const TRAINER_ROLE_ID = 2;

type ModalMode = 'add' | 'edit' | null;

interface TrainerFormData {
  userName: string;
  email: string;
  courseId: number | '';
  password: string;
}

const emptyForm: TrainerFormData = {
  userName: '',
  email: '',
  courseId: '',
  password: '',
};

export default function TrainerDetails() {
  // ─── Data State ─────────────────────────────────────────────────────────────
  const [trainers, setTrainers] = useState<UserDTO[]>([]);
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const toast = useToast();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(trainers.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ─── Modal State ────────────────────────────────────────────────────────────
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<UserDTO | null>(null);
  const [formData, setFormData] = useState<TrainerFormData>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);

  // ─── Fetch trainers & courses in parallel ───────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const [trainersRes, coursesRes] = await Promise.all([
        viewUsersByRole(TRAINER_ROLE_ID),
        getAllCourses(),
      ]);
      setTrainers(trainersRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Modal Helpers ──────────────────────────────────────────────────────────
  const openAddModal = () => {
    setSelectedTrainer(null);
    setFormData(emptyForm);
    setModalMode('add');
  };

  const openEditModal = (trainer: UserDTO) => {
    setSelectedTrainer(trainer);
    // Pre-select the course that matches the trainer's current courseName
    const matchedCourse = courses.find((c) => c.courseName === trainer.courseName);
    setFormData({
      userName: trainer.userName,
      email: trainer.email,
      courseId: matchedCourse?.courseId ?? '',
      password: '',
    });
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTrainer(null);
    setFormData(emptyForm);
  };

  // ─── Form Handler ───────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ─── Build payload helper ───────────────────────────────────────────────────
  const buildPayload = (): UpdateUserPayload => ({
    userName: formData.userName.trim(),
    email: formData.email.trim(),
    roleId: TRAINER_ROLE_ID,
    courseId: formData.courseId !== '' ? Number(formData.courseId) : null,
  });

  const buildRegisterPayload = () => ({
    userName: formData.userName.trim(),
    email: formData.email.trim(),
    userPassword: formData.password,
    roleId: TRAINER_ROLE_ID,
    courseId: formData.courseId !== '' ? Number(formData.courseId) : null,
  });

  // ─── Save (Add / Edit) ──────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (modalMode === 'add' && !formData.password.trim()) {
      toast.error('Please enter a password for the new trainer.');
      return;
    }

    setSaving(true);
    try {
      if (modalMode === 'edit' && selectedTrainer) {
        // PUT /user/updateUser/{userId}
        const payload = buildPayload();
        const res = await updateUser(selectedTrainer.userId, payload);
        setTrainers((prev) =>
          prev.map((t) => (t.userId === selectedTrainer.userId ? res.data : t)),
        );
        toast.success('Trainer updated successfully!');
      } else {
        // POST /api/auth/register
        const registerPayload = buildRegisterPayload();
        const res = await registerUser(registerPayload);
        setTrainers((prev) => [...prev, res.data]);
        toast.success('Trainer registered successfully!');
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save trainer:', err);
      const axiosErr = err as AxiosError<any>;
      const data = axiosErr.response?.data;
      let serverMsg = axiosErr.message || 'Failed to save trainer. Please try again.';
      
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

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (trainer: UserDTO) => {
    if (!window.confirm(`Delete trainer "${trainer.userName}"? This cannot be undone.`)) return;
    setDeleting(trainer.userId);
    try {
      await deleteUser(trainer.userId);
      setTrainers((prev) => prev.filter((t) => t.userId !== trainer.userId));
      toast.success(`Trainer "${trainer.userName}" deleted successfully!`);
    } catch (err) {
      console.error('Failed to delete trainer:', err);
      toast.error('Failed to delete trainer. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // Pagination calculations
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedTrainers = trainers.slice(startIndex, startIndex + itemsPerPage);

  // ─── Render ─────────────────────────────────────────────────────────────────
  const modalTitle = modalMode === 'edit' ? 'Edit Trainer' : 'Add New Trainer';

  return (
    <main className="admin-page">
      {/* ── Page heading ── */}
      <section className="page-heading student-heading">
        <div>
          <h2>Trainer Details</h2>
          <p>View and manage your training staff</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="icon-btn view"
            onClick={fetchData}
            disabled={loading}
            aria-label="Refresh trainers"
            title="Refresh"
          >
            <FiRefreshCw className={loading ? 'spin' : ''} />
          </button>
          <button className="add-btn" id="add-trainer-btn" onClick={openAddModal}>
            <FiPlus />
            Add Trainer
          </button>
        </div>
      </section>

      {/* ── Table panel ── */}
      <section className="panel table-panel scrollable-table-panel">
        {loading && (
          <div className="loading-state">
            <FiRefreshCw className="spin" />
            <span>Loading trainers…</span>
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
                    <th>S.No</th>
                    <th>Trainer Name</th>
                    <th>Email ID</th>
                    <th>Course</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTrainers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', opacity: 0.6 }}>
                        No trainers found.
                      </td>
                    </tr>
                  ) : (
                    paginatedTrainers.map((trainer, index) => (
                      <tr key={trainer.userId}>
                        <td>{startIndex + index + 1}</td>
                        <td>{trainer.userName}</td>
                        <td>{trainer.email}</td>
                        <td>
                          {trainer.courseName ? (
                            <span className="course-pill">{trainer.courseName}</span>
                          ) : (
                            <span style={{ opacity: 0.5 }}>—</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="icon-btn edit"
                            aria-label={`Edit ${trainer.userName}`}
                            title="Edit trainer"
                            onClick={() => openEditModal(trainer)}
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="icon-btn delete"
                            aria-label={`Delete ${trainer.userName}`}
                            title="Delete trainer"
                            disabled={deleting === trainer.userId}
                            onClick={() => handleDelete(trainer)}
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
              totalItems={trainers.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(size) => {
                setItemsPerPage(size);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </section>

      {/* ── Add / Edit Modal ── */}
      {modalMode !== null && (
        <div className="modal-overlay">
          <form className="modal-box" autoComplete="off" onSubmit={handleSave} id="trainer-modal-form">
            <div className="modal-header">
              <h2>{modalTitle}</h2>
              <button
                type="button"
                className="close-btn"
                aria-label="Close modal"
                onClick={closeModal}
              >
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              {/* Trainer Name */}
              <div className="form-group">
                <label htmlFor="td-userName">
                  <FiUser style={{ marginRight: '0.4rem' }} />
                  Trainer Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="td-userName"
                  type="text"
                  name="userName"
                  placeholder="Enter trainer name"
                  autoComplete="off"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="td-email">
                  <FiMail style={{ marginRight: '0.4rem' }} />
                  Email ID <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="td-email"
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              {/* Course dropdown */}
              <div className="form-group">
                <label htmlFor="td-courseId">
                  <FiBookOpen style={{ marginRight: '0.4rem' }} />
                  Course
                </label>
                <select
                  id="td-courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  disabled={saving || courses.length === 0}
                >
                  <option value="">
                    {courses.length === 0 ? 'No courses available' : '— Select a course —'}
                  </option>
                  {courses.map((course) => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseName}{' '}
                      ({course.courseDuration} {course.courseDuration === 1 ? 'month' : 'months'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Password — only shown when adding a new trainer */}
              {modalMode === 'add' && (
                <div className="form-group">
                  <label htmlFor="td-password">
                    <FiLock style={{ marginRight: '0.4rem' }} />
                    Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="td-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={saving}
                      style={{ paddingRight: '2.8rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0,
                      }}
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="cancel-btn"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? 'Saving…' : modalMode === 'edit' ? 'Save Changes' : 'Add Trainer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
