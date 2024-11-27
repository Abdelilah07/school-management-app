import React from 'react';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import {
  setShowAddAssignmentModal,
  toggleEditingMode,
} from '../../../features/scheduler/schedulerSlice';

const AssignmentHeader = () => {
  const dispatch = useDispatch();

  return (
    <div className="assignment-header">
      <button
        className="btn btn-primary btn-sm gap-2"
        onClick={() => {
          dispatch(setShowAddAssignmentModal(true));
          dispatch(toggleEditingMode(true)); // Enable editing state when adding
        }}
      >
        <Plus />
        Add Assignment
      </button>
    </div>
  );
};

export default AssignmentHeader;
