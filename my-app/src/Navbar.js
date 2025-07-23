import React from 'react';

function Navbar({ onSidebarToggle }) {
  return (
    <nav className="flex items-center justify-between bg-blue-600 p-4 text-white">
      <button
        className="md:hidden focus:outline-none"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span className="font-bold text-xl">My App</span>
      <div className="hidden md:block"></div>
    </nav>
  );
}

export default Navbar; 