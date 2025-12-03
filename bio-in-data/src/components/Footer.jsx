// src/components/Footer.jsx
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">

        <div>
          <div className="logo-mark" style={{ marginBottom: "0.5rem" }}>🍃</div>
          <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>
            Biology in Data
          </h3>
          <p style={{ color: "#cbd5e1", fontSize: "0.9rem", maxWidth: "260px" }}>
            Advancing biological research through open data and collaboration.
          </p>
        </div>

        <div className="footer-column">
          <h4>Platform</h4>
          <ul>
            <li><a href="#research">Research</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="#upload">Upload Study</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">API Access</a></li>
            <li><a href="#">Community</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Biology in Data. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
