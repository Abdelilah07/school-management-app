import React from 'react';
import Week from './components/Week';
import AssignmentModal from './components/AssignmentModal';
import Sidebar from './components/Sidebar';
import SchedulerHeader from './components/SchedulerHeader';

function App() {
  return (
    <div className="flex h-screen">
      {/* Weekly Calendar Section */}
      <div className="flex-grow flex flex-col">
        <SchedulerHeader />
        <div className="flex-grow p-4">
          <Week />
          <AssignmentModal />
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="w-1/5 p-4">
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
