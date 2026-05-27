import "./Layout.css";
import logo from "../assets/logo.png";

function Topbar({ role, onLogout }) {
  const formatRole = (role) => {
    if (role === "ADMIN") return "Super Admin";
    return "Trainer";
  };

  return (
    <nav className="topbar navbar  shadow-sm position-sticky top-0 ">
      <div className="navbar-left">
        <img src={logo} alt="" width={55} height={55} className="img-fluid rounded-circle border border-primary border-2" />
        <span className="navbar-brand mb-0 mx-3 fs-3">IAT Technologies</span>
      </div>
      <div className="navbar-right d-flex align-items-center gap-3">
        <div className="role-badge badge  text-opacity-10" style={{color:"orange"}}>{formatRole(role)}</div>
        <button
          onClick={onLogout}
          className="btn btn-sm  fw-bold logout" style={{color:"orange"}}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Topbar;
