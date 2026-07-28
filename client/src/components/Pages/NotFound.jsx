import React from 'react';
import { Link } from 'react-router-dom';
import './not-found.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-code">404</h1>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-message">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="not-found-link">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
