// src/Navbar.js

import React, { useState, useEffect, useRef } from 'react';
import ProfilePicture from './../profile.png'
import STLogo from './../logo.png'
import { useAuth } from '../Auth';


const Navbar = () => {
  const {logout} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null); // Create a ref for the overlay

  const toggleOverlay = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    // Check if the clicked element is outside the overlay
    if (overlayRef.current && !overlayRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Add event listener when overlay is open
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Clean up the event listener when overlay is closed
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="navbar">
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img src={STLogo} alt='steng-logo' style={{width: '140px', marginLeft: '20px'}}/>
        <p className='logotext'>ChatBot</p>
      </div>
      
      <div className="navbar-brand">
        <button onClick={toggleOverlay} className="navbar-button">
          <img src={ProfilePicture} alt='profile' style={{width: '40px'}}/>
          <p style={{marginLeft: '10px'}}>User</p>
        </button>
        {isOpen && (
          <div className="overlay" ref={overlayRef}>
            <ul className="overlay-links">
              <li><a href="/">Home</a></li>
              <li><a href="/">Settings</a></li>
              <li onClick={()=>logout()}><a href="/login">Log Out</a></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;