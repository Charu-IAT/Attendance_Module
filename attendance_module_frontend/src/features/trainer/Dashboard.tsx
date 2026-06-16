import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { FiBookOpen, FiArrowRight, FiUserCheck, FiUserX, FiUsers, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getTrainerDashboard, getStudentsByTrainer, getStudentsByCourse, viewAllUsers } from '../../api/services';
import type { AxiosError } from 'axios';
import type { TrainerDashboardDTO } from '../../types/attendance.types';
import type { StudentDTO } from '../../types/student.types';
import { getUserId, getUserName, setUserId } from '../../hooks/useAuth';


interface StatWidget {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone: string;
}

const today = new Date().toISOString().split('T')[0];

export default function Dashboard() {
  const navigate = useNavigate();
  const trainerName = getUserName();
  

  const [dashStats, setDashStats] = useState<TrainerDashboardDTO | null>(null);
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Resolve userId on-demand if the login response did not include it
      let resolvedId = getUserId();
      let trainerCourseName: string | null = null;

      if (resolvedId === null) {
        try {
          const usersRes = await viewAllUsers();
          const match = usersRes.data.find((u) => u.userName === trainerName);
          if (match) {
            resolvedId = match.userId;
            trainerCourseName = match.courseName;
            setUserId(resolvedId); // cache so subsequent loads skip this step
          }
        } catch (err) {
          console.warn('Non-fatal: Could not resolve trainer ID from user list:', err);
        }
      }

      let dashData = { totalStudents: 0, totalPresent: 0, totalAbsent: 0 };
      let studentsData: StudentDTO[] = [];

      try {
        const [dashRes, studentsRes] = await Promise.all([
          getTrainerDashboard(today),
          getStudentsByTrainer(resolvedId),
        ]);
        dashData = dashRes.data;
        studentsData = studentsRes.data;
      } catch (err) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 400 || axiosErr.response?.status === 404) {
          dashData = { totalStudents: 0, totalPresent: 0, totalAbsent: 0 };
          
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
        } else {
          throw err;
        }
      }

      setDashStats(dashData);
      setStudents(studentsData);
    } catch (err) {
      console.error('Failed to load trainer dashboard:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [trainerName]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Course distribution
  const courseCounts = students.reduce<Record<string, number>>((acc, s) => {
    acc[s.courseName] = (acc[s.courseName] ?? 0) + 1;
    return acc;
  }, {});
  const courseList = Object.entries(courseCounts).map(([name, count]) => ({ name, count }));
  const maxCount = Math.max(...courseList.map((c) => c.count), 1);
  const courseColors = ['blue', 'purple', 'green', 'orange', 'red'];

  const recentStudents = students.slice(-4).reverse();

  const stats: StatWidget[] = [
    { label: 'Total Students',  value: dashStats?.totalStudents ?? students.length, icon: <FiUsers />,     tone: 'blue'   },
    { label: 'Present Today',   value: dashStats?.totalPresent  ?? '—',             icon: <FiUserCheck />, tone: 'green'  },
    { label: 'Ongoing Student', value: students.length || '—',                   icon: <FiBookOpen />,  tone: 'orange' },
    { label: 'Absent Today',    value: dashStats?.totalAbsent   ?? '—',             icon: <FiUserX />,     tone: 'red'    },
  ];

  return (
    <main className="dash-page">
      <div className="dash-heading" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2>Welcome, {dashStats?.trainerName ?? trainerName}!</h2>
          <p>Track your students' attendance and performance — <strong>{today}</strong>.</p>
        </div>
        <button
          className="icon-btn view"
          onClick={fetchDashboard}
          disabled={loading}
          title="Refresh"
          aria-label="Refresh dashboard"
          style={{ marginTop: '4px' }}
        >
          <FiRefreshCw className={loading ? 'spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="error-state" style={{ padding: '12px 0', fontSize: '15px' }}>
          <p>{error}</p>
          <button className="add-btn" onClick={fetchDashboard} style={{ marginTop: '8px' }}>Retry</button>
        </div>
      )}

      {/* Stat widgets */}
      <div className="dash-widgets">
        {stats.map((s) => (
          <div className={`dash-widget dash-widget--${s.tone}`} key={s.label}>
            <div className="dash-widget__icon">{s.icon}</div>
            <div className="dash-widget__body">
              <span className="dash-widget__label">{s.label}</span>
              <strong className="dash-widget__value">
                {loading ? <FiRefreshCw className="spin" style={{ fontSize: '18px' }} /> : s.value}
              </strong>
            </div>
            <div className="dash-widget__bar" />
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="dash-grid">
        {/* Recent students */}
        <div className="dash-card">
          <h3 className="dash-card__title">Recent Activity</h3>
          <div className="dash-activity">
            {loading ? (
              <p className="dash-empty">Loading…</p>
            ) : recentStudents.length === 0 ? (
              <p className="dash-empty">No students assigned to you yet.</p>
            ) : (
              recentStudents.map((s) => (
                <div className="dash-activity__row" key={s.studentId}>
                  <span className="dash-dot dash-dot--present" />
                  <div className="dash-activity__info">
                    <strong>{s.studentName}</strong>
                    <span className="status-present">{s.courseName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Course distribution */}
        <div className="dash-card">
          <h3 className="dash-card__title">Course Distribution</h3>
          <div className="dash-courses">
            {loading ? (
              <p className="dash-empty">Loading…</p>
            ) : courseList.length === 0 ? (
              <p className="dash-empty">No course data yet.</p>
            ) : (
              courseList.map((c, i) => (
                <div className="dash-course" key={c.name}>
                  <div className="dash-course__meta">
                    <span className="dash-course__name">{c.name}</span>
                    <span className="dash-course__count">
                      {c.count} student{c.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="dash-track">
                    <div
                      className={`dash-bar dash-bar--${courseColors[i % courseColors.length]}`}
                      style={{ width: `${(c.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick-action bar */}
      <div className="dash-actions-bar">
        <div>
          <h3>Ready to manage your classes?</h3>
          <p>Mark attendance or review your student list.</p>
        </div>
        <div className="dash-actions-btns">
          <button
            className="dash-btn-primary"
            onClick={() => navigate('/trainer/attendance-management')}
          >
            Take Attendance <FiArrowRight />
          </button>
          <button
            className="dash-btn-secondary"
            onClick={() => navigate('/trainer/student-details')}
          >
            View Students
          </button>
        </div>
      </div>
    </main>
  );
}
