import { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/global.css';

interface TrainerSession {
  name?: string;
  email?: string;
}

function readTrainerSession(): TrainerSession | null {
  try {
    return JSON.parse(sessionStorage.getItem('loggedInTrainer') ?? 'null') as TrainerSession | null;
  } catch {
    return null;
  }
}

export default function TrainerLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => window.innerWidth < 768);

  const trainerName = useMemo(() => {
    const trainer = readTrainerSession();
    return trainer?.name ?? 'Trainer';
  }, []);

  return (
    <div className={`layout trainer-layout${isSidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} onClose={() => setIsSidebarCollapsed(true)} />
      {!isSidebarCollapsed && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarCollapsed(true)} />
      )}

      <div className="content">
        <Header
          title="Trainer Panel"
          userName={trainerName}
          userRole="Trainer"
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((v) => !v)}
        />
        <Outlet />
      </div>
    </div>
  );
}
