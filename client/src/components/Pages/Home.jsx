import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <h1>
            <span className="hero-accent">API Creator</span>
          </h1>
          <p>
            Define a data model, generate a Mongoose schema, Express controller,
            and router — then drop the files straight into your project.
          </p>
          <Link to="/create" className="hero-cta">
            Start Building →
          </Link>
        </div>
      </section>

      <div className="page-content">
        <section className="all-companies-section">
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🗂️</span>
              <h3>Schema First</h3>
              <p>
                Name your model, add fields with types and required flags, and
                let the engine do the rest.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Instant Scaffolding</h3>
              <p>
                Full CRUD route, controller, and Mongoose model generated in
                milliseconds.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📥</span>
              <h3>Download or Save</h3>
              <p>
                Copy the code directly, download individual files, or write them
                to your server's output directory.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
