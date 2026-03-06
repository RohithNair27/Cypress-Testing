import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // User data is passed via router state from Login
  const user = location.state?.user || null;

  // If someone navigates to /dashboard directly without logging in, send them back
  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="dashboard-icon-circle" style={{ background: "linear-gradient(135deg,#fee2e2,#fecaca)" }}>
            <span className="material-symbols-outlined" style={{ color: "#dc2626" }}>lock</span>
          </div>
          <h1 className="dashboard-title" style={{ fontSize: "1.25rem" }}>Not logged in</h1>
          <p className="dashboard-subtitle">Please log in to access this page.</p>
          <button className="logout-btn" onClick={() => navigate("/")}>
            <span className="material-symbols-outlined">login</span>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        {/* Icon */}
        <div className="dashboard-icon-circle">
          <span className="material-symbols-outlined">verified_user</span>
        </div>

        {/* Heading */}
        <h1 className="dashboard-title">Login Successful!</h1>
        <p className="dashboard-subtitle">You are now authenticated.</p>

        {/* User info box */}
        <div className="dashboard-info-box">
          <div className="dashboard-info-row">
            <span className="material-symbols-outlined dashboard-info-icon">
              email
            </span>
            <div>
              <p className="dashboard-info-label">Logged in as</p>
              <p id="user-email" className="dashboard-info-value">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          id="logout-btn"
          className="logout-btn"
          onClick={() => navigate("/")}
        >
          <span className="material-symbols-outlined">logout</span>
          Log Out
        </button>
      </div>
    </div>
  );
}
