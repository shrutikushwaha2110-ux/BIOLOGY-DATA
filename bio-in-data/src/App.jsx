import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import LoginModal from "./components/LoginModal";
import UploadModal from "./components/UploadModal";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState("home");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  const handleLogin = (token, user) => {
    const username = user.username || user;
    const role = user.role || "user";
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    setIsLoggedIn(true);
    setUsername(username);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setShowUploadModal(false);
  };

  const handleUploadClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setShowUploadModal(true);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1 onClick={() => setCurrentPage("home")} style={{ cursor: "pointer" }}>🧬 BioResearch</h1>
            </div>
            <nav className="nav">
              <button 
                className={`nav-link ${currentPage === "home" ? "active" : ""}`}
                onClick={() => setCurrentPage("home")}
              >
                Home
              </button>
              <button 
                className={`nav-link ${currentPage === "browse" ? "active" : ""}`}
                onClick={() => setCurrentPage("browse")}
              >
                Browse Data
              </button>
              <button className="nav-link upload-btn" onClick={handleUploadClick}>
                Upload Data
              </button>
            </nav>
            <div className="auth-section">
              {isLoggedIn ? (
                <>
                  <span className="user-name">{username}</span>
                  <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <button className="btn-login" onClick={() => setShowLoginModal(true)}>Login</button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        {currentPage === "home" && <Home onUploadClick={handleUploadClick} />}
        {currentPage === "browse" && <Browse />}
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 BioResearch Platform. All rights reserved.</p>
        </div>
      </footer>

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onUploadNext={() => {
            setShowLoginModal(false);
            setShowUploadModal(true);
          }}
        />
      )}
      {showUploadModal && isLoggedIn && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}

export default App;
