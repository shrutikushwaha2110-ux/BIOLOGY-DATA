// src/components/SubscribeSection.jsx
function SubscribeSection() {
  return (
    <section className="subscribe-bar">
      <h2>Stay Updated</h2>
      <p>
        Subscribe to receive updates on the latest biological research, data
        insights, and platform features.
      </p>

      <div className="subscribe-input-row">
        <input type="email" placeholder="Enter your email" />
        <button className="btn btn-secondary subscribe-btn">
          Subscribe
        </button>
      </div>
    </section>
  );
}

export default SubscribeSection;
