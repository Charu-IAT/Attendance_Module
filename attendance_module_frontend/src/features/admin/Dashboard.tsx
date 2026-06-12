import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { FiBookOpen, FiUserCheck, FiUserX, FiUsers, FiRefreshCw } from 'react-icons/fi';
import { getAdminDashboard, getAllAttendance } from '../../api/services';
import type { AdminDashboardDTO, AttendanceSummaryDTO } from '../../types/attendance.types';

interface StatWidget {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone: string;
}

const today = new Date().toISOString().split('T')[0];

export default function Dashboard() {
  const [stats, setStats] = useState<AdminDashboardDTO | null>(null);
  const [activity, setActivity] = useState<AttendanceSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, attRes] = await Promise.all([
        getAdminDashboard(today),
        getAllAttendance(),
      ]);
      setStats(dashRes.data);
      // Show the 5 most recent attendance entries as activity
      setActivity(attRes.data.slice(-5).reverse());
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const widgets: StatWidget[] = [
    { label: 'Total Students',        value: stats?.totalStudents  ?? '—', icon: <FiUsers />,     tone: 'blue'   },
    { label: 'Present Today',         value: stats?.totalPresent   ?? '—', icon: <FiUserCheck />, tone: 'green'  },
    { label: 'Absent Today',          value: stats?.totalAbsent    ?? '—', icon: <FiUserX />,     tone: 'red'    },
    { label: 'Total Ongoing Student', value: stats?.totalOngoing   ?? '—', icon: <FiBookOpen />,  tone: 'orange' },
  ];

  return (
    <main className="dash-page">
      <div className="dash-heading" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2>Dashboard Overview</h2>
          <p>Welcome back! Here's what's happening today — <strong>{today}</strong>.</p>
        </div>
        <button
          className="icon-btn view"
          onClick={fetchDashboard}
          disabled={loading}
          title="Refresh dashboard"
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
        {widgets.map((s) => (
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

      {/* Activity + info grid */}
      <div className="dash-grid">
        {/* Recent Attendance Activity */}
        <div className="dash-card">
          <h3 className="dash-card__title">Recent Attendance Activity</h3>
          <div className="dash-activity">
            {loading ? (
              <p className="dash-empty">Loading…</p>
            ) : activity.length === 0 ? (
              <p className="dash-empty">No attendance records found.</p>
            ) : (
              activity.map((a) => (
                <div className="dash-activity__row" key={a.attendanceId}>
                  <span
                    className={`dash-dot dash-dot--${a.attendanceStatus === 'Present' ? 'present' : 'absent'}`}
                  />
                  <div className="dash-activity__info">
                    <strong>{a.studentName}</strong>
                    <span className={a.attendanceStatus === 'Present' ? 'status-present' : 'status-absent'}>
                      {a.attendanceStatus} · {a.courseName}
                    </span>
                  </div>
                  <span className="dash-activity__time">{a.attendanceDate}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Summary card */}
        <div className="dash-card">
          <h3 className="dash-card__title">Today's Summary</h3>
          <div className="dash-courses">
            {[
              { label: 'Total Students',  value: stats?.totalStudents, color: '#2563eb' },
              { label: 'Present',         value: stats?.totalPresent,  color: '#007a38' },
              { label: 'Absent',          value: stats?.totalAbsent,   color: '#c50000' },
              { label: 'Ongoing Student', value: stats?.totalOngoing,  color: '#c2410c' },
            ].map(({ label, value, color }) => (
              <div className="dash-course" key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div className="dash-course__meta">
                  <span className="dash-course__name">{label}</span>
                </div>
                <strong style={{ color, fontSize: '26px', fontWeight: 800 }}>
                  {loading ? '…' : (value ?? '—')}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
