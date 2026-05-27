import { Outlet, useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import "./Layout.css";

function MainLayout() {
  const navigate = useNavigate();
  const getRole = () => {
  return localStorage.getItem("role");
};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Topbar role={role} onLogout={handleLogout} />
      <div className="layout-container d-flex justify-content-space-between align-items-start">
        <Sidebar />
        <div className="layout-content flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MainLayout;
