import React from 'react';
import './home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <h1>
            <span className="hero-accent">Name of App Goes Here</span>
          </h1>
          <p>Explanation of App or App Slogan Goes Here</p>
        </div>
      </section>

      <div className="page-content">
        <section className="all-companies-section">
          <h2>This Component Wraps Around All Your Other Components</h2>
        </section>
      </div>
    </div>
  );
};

export default Home;
