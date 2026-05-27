import { NavLink } from "react-router-dom";
import "./Layout.css";

const sidebarItems = [
  { to: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
  { to: "/trainer", label: "Trainer", icon: "bi-person-check-fill" },
  { to: "/dashboard", label: "Dashboard", icon: "bi-people" },
];

function Sidebar() {
  const getRole = () => {
    return localStorage.getItem("role");
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <NavLink
            to={item.to}
            key={item.to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <i className={`bi ${item.icon} icon`} />
            <span className="label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
