import React from 'react';
import './header.css';

const Header = ({ title, subtitle }) => {
  return (
    <header className="page-header">
      <div className="header-overlay">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
};

export default Header;
