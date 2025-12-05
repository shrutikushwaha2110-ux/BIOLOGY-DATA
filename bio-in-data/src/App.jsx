import { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminUploads from "./pages/AdminUploads";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(role === "admin");
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setIsLoggedIn(true);
    setIsAdmin(role === "admin");
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentPage("dashboard");
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>🧬 BioInData</h1>
          </div>
          <nav className="nav">
            <button
              className={`nav-btn ${currentPage === "dashboard" ? "active" : ""}`}
              onClick={() => setCurrentPage("dashboard")}
            >
              Research
            </button>
            {isAdmin && (
              <button
                className={`nav-btn ${currentPage === "uploads" ? "active" : ""}`}
                onClick={() => setCurrentPage("uploads")}
              >
                Admin - Uploads
              </button>
            )}
          </nav>
          <div className="user-section">
            <span className="user-role">{isAdmin ? "Admin" : "User"}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "uploads" && isAdmin && <AdminUploads />}
      </main>

      <footer className="footer">
        <p>&copy; 2025 BioInData Research Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
