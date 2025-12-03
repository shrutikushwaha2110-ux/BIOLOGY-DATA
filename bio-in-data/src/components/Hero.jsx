// src/components/Hero.jsx
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <h1 className="hero-title">Exploring Biology Through Data</h1>
        <p className="hero-subtitle">
          A comprehensive platform for biological research data, insights, and
          discoveries. Explore peer-reviewed studies, visualize complex
          datasets, and contribute to the scientific community.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary">Explore Research</button>
          <button className="btn btn-secondary">Upload Study</button>
        </div>
      </div>

      <div className="hero-right">
        {/* Replace src with your microscope image when you have it in /assets */}
        <div className="hero-image-circle">
          <span>Microscope Image</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
