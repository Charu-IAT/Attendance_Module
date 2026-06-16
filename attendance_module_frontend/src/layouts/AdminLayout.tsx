import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getUserName } from '../hooks/useAuth';
import '../styles/global.css';

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => window.innerWidth < 768);
  const userName = getUserName();

  return (
    <div className={`layout admin-layout${isSidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} onClose={() => setIsSidebarCollapsed(true)} />
      {!isSidebarCollapsed && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarCollapsed(true)} />
      )}

      <div className="content">
        <Header
          title="Admin Panel"
          userName={userName}
          userRole="Administrator"
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((v) => !v)}
        />
        <Outlet />
      </div>
    </div>
  );
}
