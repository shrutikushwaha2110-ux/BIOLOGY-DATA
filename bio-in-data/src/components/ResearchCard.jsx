function ResearchCard({ title, category, summary }) {
  return (
    <div className="research-card">
      <h3>{title}</h3>
      <p className="research-category">{category}</p>
      <p className="research-summary">{summary}</p>
      <button className="btn-link">Read More →</button>
    </div>
  );
}

export default ResearchCard;
