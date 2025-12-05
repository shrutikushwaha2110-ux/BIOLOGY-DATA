import "../styles/ResearchCard.css";

function ResearchCard({ item }) {
  const title = item.title || item.name || "Untitled";
  const description = item.abstract || item.description || "No description available";
  const category = item.category || item.category_name || "General";

  return (
    <div className="research-card">
      <div className="card-header">
        <h3>{title}</h3>
        <span className="category-tag">{category}</span>
      </div>
      <p className="card-description">{description.substring(0, 150)}...</p>
      <div className="card-footer">
        <button className="view-btn">View Details</button>
      </div>
    </div>
  );
}

export default ResearchCard;
