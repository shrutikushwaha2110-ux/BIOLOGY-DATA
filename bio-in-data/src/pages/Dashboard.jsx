import { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { API_BASE } from "../utils/api";
import ResearchCard from "../components/ResearchCard";

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].name);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchResearchByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchResearchByCategory = async (category) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/search?query=${encodeURIComponent(category)}`);
      if (!response.ok) throw new Error("Failed to fetch research");
      const data = await response.json();
      setResearch(data || []);
    } catch (err) {
      setError(err.message);
      setResearch([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <aside className="sidebar">
          <h3>Categories</h3>
          <div className="categories-list">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`category-btn ${selectedCategory === cat.name ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <span>{cat.name}</span>
                <span className="count">({cat.count})</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="research-section">
          <div className="section-header">
            <h2>{selectedCategory || "Research"}</h2>
            {loading && <span className="loading-spinner">Loading...</span>}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="research-grid">
            {research.length > 0 ? (
              research.map((item, idx) => (
                <ResearchCard key={idx} item={item} />
              ))
            ) : (
              <div className="no-results">No research data found for this category.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
