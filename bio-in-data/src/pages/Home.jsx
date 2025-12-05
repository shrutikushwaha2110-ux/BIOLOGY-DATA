import { useState, useEffect } from "react";
import { API_BASE } from "../utils/api";
import ResearchCard from "../components/ResearchCard";
import "../styles/Home.css";

function Home({ onUploadClick }) {
  const [categories, setCategories] = useState([]);
  const [featuredResearch, setFeaturedResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchFeaturedResearch();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFeaturedResearch = async () => {
    try {
      const response = await fetch(`${API_BASE}/search?q=featured`);
      const data = await response.json();
      // API returns { q, count, results }
      const items = Array.isArray(data) ? data : (data.results || []);
      setFeaturedResearch(items.slice(0, 6));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching research:", error);
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Insights, charts and data for biology research</h1>
            <p>Explore comprehensive biological research data, analysis, and visualizations</p>
            <button className="btn-primary" onClick={onUploadClick}>
              + Upload Research Data
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Explore by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">
                  {category.emoji || "📊"}
                </div>
                <h3>{category.name}</h3>
                <p>{category.description || "Explore this category"}</p>
                <button className="btn-secondary">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Research Section */}
      <section className="featured-section">
        <div className="container">
          <h2>Featured Research & Data</h2>
          <p className="section-subtitle">Latest uploads and most-viewed datasets</p>
          
          {loading ? (
            <div className="loading">Loading research...</div>
          ) : (
            <div className="research-grid">
              {featuredResearch.length > 0 ? (
                featuredResearch.map((item, index) => (
                  <ResearchCard key={index} item={item} />
                ))
              ) : (
                <div className="no-data">No research data available yet</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Have research data to share?</h2>
            <p>Upload your research, charts, and datasets to contribute to our growing knowledge base</p>
            <button className="btn-primary-large" onClick={onUploadClick}>
              Start Uploading
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
