function CategoryCard({ icon, title, desc }) {
  return (
    <div className="category-card">
      <div className="category-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export default CategoryCard;
