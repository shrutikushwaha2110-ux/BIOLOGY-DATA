import CategoryCard from "./CategoryCard";

const categories = [
  { icon: "🧬", title: "Genetics", desc: "DNA, heredity & sequencing." },
  { icon: "🔬", title: "Microbiology", desc: "Bacteria & viral research." },
  { icon: "🌱", title: "Ecology", desc: "Habitats & biodiversity." },
  { icon: "🧪", title: "Biotechnology", desc: "Applied biological science." },
];

function CategorySection() {
  return (
    <section className="categories">
      <h2>Explore by Category</h2>

      <div className="category-grid">
        {categories.map((cat) => (
          <CategoryCard key={cat.title} {...cat} />
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
