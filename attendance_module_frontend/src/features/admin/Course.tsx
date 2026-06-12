import { useState, useEffect, useCallback } from 'react';
import { FiEdit, FiEye, FiPlus, FiX, FiBook, FiRefreshCw } from 'react-icons/fi';
import type { CourseDTO } from '../../types/course.types';
import { getAllCourses, addCourse, updateCourse } from '../../api/services';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CourseFormData {
  courseName: string;
  courseDuration: string; // kept as string for input binding
}

const emptyCourse: CourseFormData = {
  courseName: '',
  courseDuration: '',
};

type ModalMode = 'add' | 'edit' | 'view' | null;

// ─── Duration badge colour helper ─────────────────────────────────────────────

function durationTone(months: number): string {
  if (months <= 3) return 'green';
  if (months <= 6) return 'blue';
  if (months <= 9) return 'orange';
  return 'purple';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Course() {
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(emptyCourse);

  const isViewMode = modalMode === 'view';
  const isEditMode = modalMode === 'edit';

  // ── fetch all courses ────────────────────────────────────────────────────

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllCourses();
      setCourses(res.data);
    } catch (err: unknown) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ── modal helpers ────────────────────────────────────────────────────────

  const resetModal = () => {
    setModalMode(null);
    setSelectedId(null);
    setFormData(emptyCourse);
  };

  const openAddModal = () => {
    setFormData(emptyCourse);
    setSelectedId(null);
    setModalMode('add');
  };

  const openModal = (mode: 'view' | 'edit', course: CourseDTO) => {
    setFormData({
      courseName: course.courseName,
      courseDuration: String(course.courseDuration),
    });
    setSelectedId(course.courseId);
    setModalMode(mode);
  };

  // ── form handlers ────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = formData.courseName.trim();
    const duration = Number(formData.courseDuration);

    if (!trimmedName) {
      alert('Please enter a course name.');
      return;
    }
    if (!formData.courseDuration || isNaN(duration) || duration <= 0) {
      alert('Please enter a valid duration (months).');
      return;
    }

    const payload = { courseName: trimmedName, courseDuration: duration };
    setSaving(true);
    setError(null);

    try {
      if (isEditMode && selectedId !== null) {
        const res = await updateCourse(selectedId, payload);
        setCourses((prev) =>
          prev.map((c) => (c.courseId === selectedId ? res.data : c)),
        );
      } else {
        const res = await addCourse(payload);
        setCourses((prev) => [...prev, res.data]);
      }
      resetModal();
    } catch (err: unknown) {
      console.error('Failed to save course:', err);
      setError(
        isEditMode
          ? 'Failed to update course. Please try again.'
          : 'Failed to add course. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const getModalTitle = (): string => {
    if (isViewMode) return 'Course Details';
    if (isEditMode) return 'Edit Course';
    return 'Add New Course';
  };

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <main className="admin-page">
      {/* Page heading */}
      <section className="page-heading student-heading">
        <div>
          <h2>Courses</h2>
          <p>Manage available training courses</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="icon-btn view"
            title="Refresh courses"
            aria-label="Refresh courses"
            onClick={fetchCourses}
            disabled={loading}
          >
            <FiRefreshCw />
          </button>
          <button className="add-btn" id="add-course-btn" onClick={openAddModal}>
            <FiPlus />
            Add Course
          </button>
        </div>
      </section>

      {/* Error banner */}
      {error && (
        <div className="error-banner" role="alert">
          {error}
          <button className="close-btn" onClick={() => setError(null)} aria-label="Dismiss error">
            <FiX />
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="course-empty-state">
          <p>Loading courses…</p>
        </div>
      )}

      {/* Empty-state */}
      {!loading && courses.length === 0 && !error && (
        <div className="course-empty-state">
          <div className="course-empty-icon">
            <FiBook />
          </div>
          <h3>No Courses Yet</h3>
          <p>Click <strong>Add Course</strong> to create your first course.</p>
        </div>
      )}

      {/* Course grid */}
      {!loading && courses.length > 0 && (
        <section className="panel table-panel scrollable-table-panel">
          <div className="table-scroll-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Name</th>
                  <th>Duration (Months)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, idx) => (
                  <tr key={course.courseId}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="course-name-cell">
                        <span className="course-icon-badge">
                          <FiBook />
                        </span>
                        {course.courseName}
                      </div>
                    </td>
                    <td>
                      <span className={`duration-badge duration-badge--${durationTone(course.courseDuration)}`}>
                        {course.courseDuration} {course.courseDuration === 1 ? 'month' : 'months'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="icon-btn view"
                        aria-label={`View ${course.courseName}`}
                        title="View course"
                        onClick={() => openModal('view', course)}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="icon-btn edit"
                        aria-label={`Edit ${course.courseName}`}
                        title="Edit course"
                        onClick={() => openModal('edit', course)}
                      >
                        <FiEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modal */}
      {modalMode && (
        <div className="modal-overlay">
          <form className="modal-box course-modal" onSubmit={handleSave} id="course-modal-form">
            <div className="modal-header">
              <h2>{getModalTitle()}</h2>
              <button
                type="button"
                className="close-btn"
                onClick={resetModal}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              {error && modalMode !== null && (
                <p className="form-error" role="alert">{error}</p>
              )}
              <div className="form-group">
                <label htmlFor="c-name">Course Name</label>
                <input
                  id="c-name"
                  type="text"
                  name="courseName"
                  placeholder="e.g., Web Development"
                  value={formData.courseName}
                  onChange={handleChange}
                  disabled={isViewMode || saving}
                  autoFocus={!isViewMode}
                />
              </div>

              <div className="form-group">
                <label htmlFor="c-duration">Duration (Months)</label>
                <input
                  id="c-duration"
                  type="number"
                  name="courseDuration"
                  placeholder="e.g., 6"
                  min={1}
                  max={36}
                  value={formData.courseDuration}
                  onChange={handleChange}
                  disabled={isViewMode || saving}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={resetModal} disabled={saving}>
                {isViewMode ? 'Close' : 'Cancel'}
              </button>
              {!isViewMode && (
                <button type="submit" className="save-btn" id="course-save-btn" disabled={saving}>
                  {saving ? 'Saving…' : isEditMode ? 'Update Course' : 'Save Course'}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
