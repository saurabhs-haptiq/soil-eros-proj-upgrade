import React from 'react';
import '../styles/Navbar.css'; // For styling

const Navbar = () => {
    return (
      <div className="navbar">
        <div className="navbar-logo">
          Soil Erosion Analysis
        </div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#data">Data</a></li>
        </ul>
      </div>
    );
  };

export default Navbar;
