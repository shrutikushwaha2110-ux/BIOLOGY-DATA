// src/components/FeaturedSection.jsx
function FeaturedSection() {
  return (
    <section className="featured" id="featured">
      <h2>Featured Research</h2>
      <p>Latest peer-reviewed studies and findings</p>

      <div className="featured-grid">

        {/* CARD 1 */}
        <div className="research-card">
          <div className="research-card-content">

            <div className="research-tag-row">
              <span className="pill">Genetics</span>
              <span className="research-year">2024</span>
            </div>

            <h3>CRISPR-Cas9 Gene Editing Efficiency in Human Embryonic Stem Cells</h3>
            <p className="research-summary">
              Analysis of CRISPR efficiency across different target sites,
              revealing factors that influence editing outcomes.
            </p>

            <div className="tag-container">
              <span className="tag-chip">CRISPR</span>
              <span className="tag-chip">Gene Editing</span>
              <span className="tag-chip">Stem Cells</span>
            </div>

            <a className="view-study" href="#">
              View Study →
            </a>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="research-card">
          <div className="research-card-content">

            <div className="research-tag-row">
              <span className="pill">Microbiology</span>
              <span className="research-year">2024</span>
            </div>

            <h3>Antibiotic Resistance Patterns in Urban Microbiomes</h3>
            <p className="research-summary">
              Survey of resistance genes in urban environments showing evolution
              of bacterial strains.
            </p>

            <div className="tag-container">
              <span className="tag-chip">Antibiotics</span>
              <span className="tag-chip">Microbiome</span>
              <span className="tag-chip">Public Health</span>
            </div>

            <a className="view-study" href="#">
              View Study →
            </a>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="research-card">
          <div className="research-card-content">

            <div className="research-tag-row">
              <span className="pill">Ecology</span>
              <span className="research-year">2023</span>
            </div>

            <h3>Climate Impact on Pollinator Population Dynamics</h3>
            <p className="research-summary">
              Study examining how changing climate patterns affect species
              distribution and behavior.
            </p>

            <div className="tag-container">
              <span className="tag-chip">Climate Change</span>
              <span className="tag-chip">Pollinators</span>
              <span className="tag-chip">Biodiversity</span>
            </div>

            <a className="view-study" href="#">
              View Study →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default FeaturedSection;
