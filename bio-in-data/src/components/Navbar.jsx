// src/components/Navbar.jsx
function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="logo-mark">🍃</div>
        <span className="logo-text">Biology in Data</span>
      </div>

      <nav className="nav-links">
        <a href="/" className="nav-link active">
          Home
        </a>
        <a href="#research" className="nav-link">
          Research
        </a>
        <a href="#categories" className="nav-link">
          Categories
        </a>
        <a href="#about" className="nav-link">
          About
        </a>
      </nav>

      <div className="nav-right">
        <button className="icon-button" aria-label="Search">
          🔍
        </button>
        <button className="nav-signin">Sign In</button>
      </div>
    </header>
  );
}

export default Navbar;
