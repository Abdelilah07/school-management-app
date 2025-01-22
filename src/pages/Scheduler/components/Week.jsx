import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignments } from '../../../features/scheduler/schedulerSlice';
import DayRow from './DayRow';
import dayjs from 'dayjs';

export default function Week() {
  const dispatch = useDispatch();
  const startOfWeekString = useSelector((state) => state.scheduler.startOfWeek);
  const startOfWeek = dayjs(startOfWeekString);
  const hours = useSelector((state) => state.scheduler.hours);
  const daysOfWeek = Array.from({ length: 6 }, (_, i) => startOfWeek.add(i, 'day'));
  const assignments = useSelector((state) => state.scheduler.assignments);
  const selectedGroupe = useSelector((state) => state.scheduler.selectedGroupe);
  const selectedFormateur = useSelector((state) => state.scheduler.selectedFormateur);

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const filteredAssignments = selectedGroupe
    ? assignments.filter((assignment) => assignment.groupe.codeGroupe === selectedGroupe)
    : selectedFormateur
      ? assignments.filter((assignment) => assignment.formateur.matricule === selectedFormateur)
      : assignments;

  return (
    <div className="overflow-x-auto p-2 pt-5 w-full ">
    <div className="w-full overflow-hidden rounded-lg border border-gray-300 shadow-md">
      <table className="w-full border-collapse text-center text-xs">
          <thead>
            <tr>
              <th className="px-1 py-5 text-base border rounded-tl-lg w-24 h-12">Day</th>
              {hours.map((hour, index) => (
                <th key={index} colSpan={2} className="px-1 py-1 text-sm border font-semibold w-24 h-12">
                  {hour.startTime} - {hour.endTime}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day, dayIndex) => (
              <DayRow key={dayIndex} day={day} hours={hours} assignments={filteredAssignments} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
