// components/SearchBar.js
import React, { useState } from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from '../ui/input';

const SearchBar = ({ onSearch, className }) => {
  const [searchTerms, setSearchTerms] = useState("");

  const handleSearch = () => {
    if (searchTerms.trim() !== "") {
      onSearch(searchTerms); // Call the function passed as a prop
      setSearchTerms(""); // Clear the input after search
    }
  };

  // Handle key down events
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Call handleSearch when Enter is pressed
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Input
        type="text"
        value={searchTerms}
        onChange={(e) => setSearchTerms(e.target.value)}
        onKeyDown={handleKeyDown} // Add the key down event handler
        placeholder="Search"
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none w-full" // Ensure full width
      />
      <button onClick={handleSearch}>
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
};

export default SearchBar;
