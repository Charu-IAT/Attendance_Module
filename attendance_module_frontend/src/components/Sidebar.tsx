import { NavLink } from 'react-router-dom';
import {
  FiClipboard,
  FiGrid,
  FiUsers,
  FiBookOpen,
  FiLogOut,
  FiAward,
  FiLayers,
} from 'react-icons/fi';
import type { ReactNode } from 'react';

interface MenuItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const adminMenuItems: MenuItem[] = [
  { label: 'Dashboard',       path: '/admin/dashboard',       icon: <FiGrid /> },
  { label: 'Trainer Details', path: '/admin/trainer-details', icon: <FiUsers /> },
  { label: 'Student Details', path: '/admin/student-details', icon: <FiBookOpen /> },
  { label: 'Courses',         path: '/admin/courses',         icon: <FiLayers /> },
  
];

const trainerMenuItems: MenuItem[] = [
  { label: 'Dashboard',             path: '/trainer/dashboard',             icon: <FiGrid /> },
  { label: 'Student Details',       path: '/trainer/student-details',       icon: <FiBookOpen /> },
  { label: 'Attendance Management', path: '/trainer/attendance-management', icon: <FiClipboard /> },
 
];

interface SidebarProps {
  isCollapsed?: boolean;
}

export default function Sidebar({ isCollapsed = false }: SidebarProps) {
  const isTrainerPanel = window.location.pathname.startsWith('/trainer');
  const menuItems = isTrainerPanel ? trainerMenuItems : adminMenuItems;

  return (
    <div className={`sidebar${isCollapsed ? ' collapsed' : ''}`}>
      <div>
        <div className="brand">
          <div className="brand-icon">
            <FiAward />
          </div>
          <div className="brand-text">
            <h2>IATT</h2>
            <p>Attendance System</p>
          </div>
        </div>

        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                className={({ isActive }) => (isActive ? 'menu active' : 'menu')}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <NavLink className="logout" to="/" title={isCollapsed ? 'Logout' : undefined}>
        <FiLogOut />
        <span>Logout</span>
      </NavLink>
    </div>
  );
}
