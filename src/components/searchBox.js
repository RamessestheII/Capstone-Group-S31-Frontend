// src/SearchBar.js
import React, { useState, useEffect, useRef } from 'react';

const SearchBox = ({ items , searchTerm, setSearchTerm, onNext}) => {
  const [suggestions, setSuggestions] = useState([]);
  const overlayRef = useRef(null); // ref for suggestions overlay

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value.trim());
    
    if (value) {
      const filteredSuggestions = items.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // function to show top 5 items of list when user clicks in input box
  const handleInputFocus = () => {
    setSuggestions(items.slice(0, 5)); // Show the first three items or customize as needed
  };
  
  // function to stop displaying suggestions when user clicks out of input box
    const handleExitSearch = (event) => {
        // Check if the clicked element is outside the overlay
        if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setSuggestions([])
        }
    };

    useEffect(() => {
        if (suggestions.length>0) {
        // Add event listener when overlay is open
        document.addEventListener('mousedown', handleExitSearch);
        } else {
        // Clean up the event listener when overlay is closed
        document.removeEventListener('mousedown', handleExitSearch);
        }

        // Cleanup on component unmount
        return () => {
        document.removeEventListener('mousedown', handleExitSearch);
        };
    }, [suggestions]);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative my-3">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onFocus={handleInputFocus}
        placeholder="Select/ Enter Sector"
        className="border border-gray-300 rounded-l-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg w-64"
        ref={overlayRef}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <button className="bg-gray-400 hover:bg-gray-500 text-white rounded-r-lg p-2 mx-1" onClick={onNext}>
        Next
      </button>
    </div>
  );
};

export default SearchBox;