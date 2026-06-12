import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  FiCalendar,
  FiDownload,
  FiFileText,
  FiPrinter,
  FiRefreshCcw,
} from 'react-icons/fi';

interface ReportCard {
  title: string;
  detail: string;
  icon: ReactNode;
  color: string;
}

interface RecentReport {
  title: string;
  meta: string;
}

interface ReportFilters {
  reportType: string;
  startDate: string;
  endDate: string;
  trainer: string;
  course: string;
  exportFormat: string;
}

const reportCards: ReportCard[] = [
  { title: 'Daily Attendance Report',       detail: 'View attendance summary for a specific date',       icon: <FiCalendar />, color: 'blue'   },
  { title: 'Monthly Attendance Report',     detail: 'Comprehensive monthly attendance statistics',       icon: <FiFileText />, color: 'purple' },
  { title: 'Student Attendance Report',     detail: 'Individual student attendance history',             icon: <FiFileText />, color: 'green'  },
  { title: 'Course-wise Attendance Report', detail: 'Attendance breakdown by course',                    icon: <FiFileText />, color: 'orange' },
];

const recentReports: RecentReport[] = [
  { title: 'Daily Attendance - June 1, 2026',    meta: 'Generated today · 245 KB'           },
  { title: 'Monthly Report - May 2026',          meta: 'Generated yesterday · 1.2 MB'       },
  { title: 'Course Report - Web Development',    meta: 'Generated Jun 1, 2026 · 680 KB'     },
];

const initialFilters: ReportFilters = {
  reportType:   'Daily Attendance',
  startDate:    '2026-06-03',
  endDate:      '2026-06-03',
  trainer:      'All Trainers',
  course:       'All Courses',
  exportFormat: 'PDF',
};

export default function Reports() {
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  const generateReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`${filters.reportType} report generated as ${filters.exportFormat}`);
  };

  return (
    <main className="admin-page reports-page">
      <section className="page-heading">
        <h2>Reports Dashboard</h2>
        <p>Generate and export attendance reports</p>
      </section>

      <section className="reports-grid">
        {reportCards.map((report) => (
          <article className={`report-card ${report.color}`} key={report.title}>
            <div className="report-card-header">
              <div className="report-icon">{report.icon}</div>
              <div>
                <h3>{report.title}</h3>
                <p>{report.detail}</p>
              </div>
            </div>

            <div className="report-actions">
              <button type="button"><FiDownload /> PDF</button>
              <button type="button"><FiDownload /> Excel</button>
              <button type="button" aria-label={`Print ${report.title}`}><FiPrinter /></button>
            </div>
          </article>
        ))}
      </section>

      <section className="panel report-section">
        <h3>Generate Custom Report</h3>

        <form className="report-filter-form" onSubmit={generateReport}>
          <div className="form-group">
            <label htmlFor="r-reportType">Report Type</label>
            <select id="r-reportType" name="reportType" value={filters.reportType} onChange={handleFilterChange}>
              <option>Daily Attendance</option>
              <option>Monthly Attendance</option>
              <option>Student Attendance</option>
              <option>Course-wise Attendance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="r-startDate">Start Date</label>
            <input id="r-startDate" type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          </div>

          <div className="form-group">
            <label htmlFor="r-endDate">End Date</label>
            <input id="r-endDate" type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
          </div>

          <div className="form-group">
            <label htmlFor="r-trainer">Trainer</label>
            <select id="r-trainer" name="trainer" value={filters.trainer} onChange={handleFilterChange}>
              <option>All Trainers</option>
              <option>John Smith</option>
              <option>Sarah Johnson</option>
              <option>Michael Brown</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="r-course">Course</label>
            <select id="r-course" name="course" value={filters.course} onChange={handleFilterChange}>
              <option>All Courses</option>
              <option>Web Development</option>
              <option>Data Science</option>
              <option>UI/UX Design</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="r-exportFormat">Export Format</label>
            <select id="r-exportFormat" name="exportFormat" value={filters.exportFormat} onChange={handleFilterChange}>
              <option>PDF</option>
              <option>Excel</option>
            </select>
          </div>

          <div className="report-form-actions">
            <button type="submit" className="generate-report-btn">
              <FiFileText /> Generate Report
            </button>
            <button type="button" className="reset-report-btn" onClick={resetFilters}>
              <FiRefreshCcw /> Reset Filters
            </button>
          </div>
        </form>
      </section>

      <section className="panel report-section recent-reports">
        <h3>Recent Reports</h3>
        <div className="recent-report-list">
          {recentReports.map((report) => (
            <article className="recent-report-row" key={report.title}>
              <FiFileText className="recent-file-icon" />
              <div>
                <h4>{report.title}</h4>
                <p>{report.meta}</p>
              </div>
              <div className="recent-report-actions">
                <button type="button" aria-label={`Download ${report.title}`}><FiDownload /></button>
                <button type="button" aria-label={`Print ${report.title}`}><FiPrinter /></button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
