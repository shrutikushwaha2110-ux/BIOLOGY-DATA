import { useState, useEffect } from "react";
import { API_BASE } from "../utils/api";
import ResearchCard from "../components/ResearchCard";
import "../styles/Browse.css";

function Browse() {
  const [research, setResearch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllResearch();
  }, []);

  const fetchAllResearch = async () => {
    setLoading(true);
    try {
      // fetch popular/default items by using a broad q or listing endpoint
      const response = await fetch(`${API_BASE}/search?q=all`);
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      setResearch(items);
    } catch (error) {
      console.error("Error fetching research:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchAllResearch();
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      setResearch(items);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="browse">
      <div className="container">
        <div className="browse-header">
          <h1>Browse All Research Data</h1>
          <p>Search and explore all available research, datasets, and charts</p>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search research, datasets, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-search">Search</button>
          <button 
            type="button" 
            className="btn-clear"
            onClick={() => {
              setSearchQuery("");
              fetchAllResearch();
            }}
          >
            Clear
          </button>
        </form>

        <div className="results-info">
          <p>{research.length} results found</p>
        </div>

        {loading ? (
          <div className="loading">Loading research...</div>
        ) : research.length > 0 ? (
          <div className="research-grid">
            {research.map((item, index) => (
              <ResearchCard key={index} item={item} />
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>No research data found. Try different search terms or upload new data.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;
