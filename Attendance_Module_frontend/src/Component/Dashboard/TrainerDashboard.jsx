import logo from "../../assets/logo.png";
function TrainerDashboard() {
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <nav className="topbar navbar  shadow-sm position-sticky top-0 ">
        <div className="navbar-left">
          <img
            src={logo}
            alt=""
            width={55}
            height={55}
            className="img-fluid rounded-circle border border-primary border-2"
          />
          <span className="navbar-brand mb-0 mx-3 fs-3">IAT Technologies</span>
        </div>
        <div className="navbar-right d-flex align-items-center gap-3">
          <button
            onClick={handleLogout}
            className="btn btn-sm  fw-bold logout"
            style={{ color: "orange" }}
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
export default TrainerDashboard;
