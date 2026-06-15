import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getUserName } from '../hooks/useAuth';
import '../styles/global.css';

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const userName = getUserName();

  return (
    <div className={`layout admin-layout${isSidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed}/>

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
