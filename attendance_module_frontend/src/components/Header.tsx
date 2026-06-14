import { FiBell, FiMenu, FiUser } from 'react-icons/fi';

interface HeaderProps {
  title: string;
  userName?: string;
  userRole?: string;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({
  title,
  userName = 'Admin User',
  userRole = 'Administrator',
  isSidebarCollapsed = false,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <div className="header">
      <div className="header-title">
        {onToggleSidebar && (
          <button
            className="sidebar-toggle"
            type="button"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={isSidebarCollapsed}
            onClick={onToggleSidebar}
          >
            <FiMenu />
          </button>
        )}
        <h1>{title}</h1>
      </div>

      <div className="header-actions">
        <div className="profile">
          <div className="profile-avatar">
            <FiUser />
          </div>
          <div>
            <h4>{userName}</h4>
            <span>{userRole}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
