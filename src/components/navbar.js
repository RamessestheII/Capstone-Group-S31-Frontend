import React, { useState, useEffect, useRef } from 'react';
import STLogo from './../logo.png'
import { useAuth } from '../Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


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
    <nav className="flex justify-between items-center h-[10%] bg-white">
      <div className='flex'>
        <div className='flex align-middle'>
          <img src={STLogo} alt='steng-logo' className='w-36 ml-16 mt-1'/>
          <p className='mt-8 ml-3 font-sans font-bold text-20 text-gray-700'>ChatBot</p>
        </div>
        
      </div>
      
      <div className="flex h-full items-center text-white text-lg font-bold relative mr-10">
        <button onClick={toggleOverlay} className="bg-white text-gray-500 border-none px-4 py-2 h-full cursor-pointer text-base flex items-center">
          <FontAwesomeIcon icon={faUser} className="h-6"/>
          <p className='ml-4'>User</p>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg z-10" ref={overlayRef}>
            <ul className="list-none p-0 m-0 text-black">
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