import React from 'react';
import Week from './components/Week';
import AssignmentModal from './components/AssignmentModal';
import Sidebar from './components/Sidebar';
import SchedulerHeader from './components/SchedulerHeader';

function SchedulerPage() {
  return (
    <div className="flex flex-col pr-10 ">
        <SchedulerHeader />
        <div className="flex relative mt-5">
          <Week />
          <AssignmentModal />
        </div>
        <Sidebar />
    </div>
  );
}

export default SchedulerPage;
