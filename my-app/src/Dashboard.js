import React from 'react';
import Navbar from './Navbar';
import TaskList from './TaskList';

function Dashboard() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar onSidebarToggle={() => {}} />
      <main className="p-4">
        <TaskList />
      </main>
    </div>
  );
}

export default Dashboard; 