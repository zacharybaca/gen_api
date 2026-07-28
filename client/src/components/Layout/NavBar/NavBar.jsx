import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/useAuth.js';
import './nav-bar.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    setIsDropdownOpen(false);
    toast.success('Successfully logged out.');
    navigate('/login');
  };

  const closeMenu = () => setIsDropdownOpen(false);

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo-link">
          <h1>MERN Starter</h1>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-item">
              Home
            </Link>
          </li>

          {!user && (
            <>
              <li>
                <Link to="/register" className="nav-item">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="nav-item">
                  Login
                </Link>
              </li>
            </>
          )}

          {user && (
            <li className="user-menu-container" ref={dropdownRef}>
              <button
                className="dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.username}'s avatar`}
                    className="nav-avatar"
                  />
                ) : (
                  <div className="nav-avatar-fallback">
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : '?'}
                  </div>
                )}

                <span className="nav-username">
                  {user.name || user.username}
                </span>
                <span className={`chevron ${isDropdownOpen ? 'open' : ''}`}>
                  ▼
                </span>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    Signed in as <strong>{user.username}</strong>
                  </div>

                  <div className="dropdown-divider"></div>

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    Settings
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="dropdown-divider"></div>

                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-item"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
