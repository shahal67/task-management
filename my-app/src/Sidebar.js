import React from 'react';

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay only on mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity duration-300 md:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar: slide on mobile, static on desktop */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:block`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          {/* Close button only on mobile */}
          <button onClick={onClose} aria-label="Close sidebar" className="text-gray-600 hover:text-gray-900 md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <a href="#" className="block px-2 py-2 rounded hover:bg-blue-100">Dashboard</a>
          <a href="#" className="block px-2 py-2 rounded hover:bg-blue-100">Profile</a>
          <a href="#" className="block px-2 py-2 rounded hover:bg-blue-100">Settings</a>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar; 