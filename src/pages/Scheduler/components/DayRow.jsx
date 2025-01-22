import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedDay,
  setSelectedEndTime,
  setSelectedStartTime,
  setShowAddAssignmentModal,
} from '../../../features/scheduler/schedulerSlice';

const DayRow = ({ day, hours, assignments }) => {
  const dispatch = useDispatch();
  const selectedFormateur = useSelector((state) => state.scheduler.selectedFormateur);
  const selectedGroupe = useSelector((state) => state.scheduler.selectedGroupe);

  useEffect(() => {
    if (!selectedFormateur || !selectedGroupe) {
      dispatch(setShowAddAssignmentModal(false));
    }
  }, [selectedFormateur, selectedGroupe, dispatch]);

  const getSpanCount = (startTime, endTime) => {
    const flatSubHours = hours.flatMap((hour) => hour.subHours);
    const startIndex = flatSubHours.findIndex((subHour) => subHour.startTime === startTime);
    const endIndex = flatSubHours.findIndex((subHour) => subHour.endTime === endTime);

    if (startIndex === -1 || endIndex === -1) {
      return 1;
    }

    return endIndex - startIndex + 1;
  };

  const isWithinAssignmentRange = (assignment, subHour) => {
    return (
      assignment.day === day.format('YYYY-MM-DD') &&
      subHour.startTime >= assignment.startTime &&
      subHour.endTime <= assignment.endTime
    );
  };

  return (
    <tr>
      <td className="px-2 py-8 border w-25 text-sm font-semibold text-gray-700">{day.format('dddd')}</td>
      {hours.map((hour) =>
        hour.subHours.map((subHour, subHourIndex) => {
          const assignment = assignments.find((assignment) =>
            isWithinAssignmentRange(assignment, subHour)
          );

          if (selectedGroupe || selectedFormateur) {
            if (assignment && subHour.startTime === assignment.startTime) {
              const spanCount = getSpanCount(assignment.startTime, assignment.endTime);
              return (
                <td
                  key={`${subHour.startTime}-${subHour.endTime}`}
                  colSpan={spanCount}
                  className="border p-2 w-25 cursor-pointer bg-primary text-primary-content hover:bg-primary/90"
                  onClick={() => {
                    dispatch(setSelectedDay(day.format('YYYY-MM-DD')));
                    dispatch(setSelectedStartTime(assignment.startTime));
                    dispatch(setSelectedEndTime(assignment.endTime));
                    dispatch(setShowAddAssignmentModal(true));
                  }}
                >
                  {assignment.title}
                </td>
              );
            }

            const isCellCovered = assignments.some((assignment) => {
              const flatSubHours = hours.flatMap((hour) => hour.subHours);
              const startIndex = flatSubHours.findIndex(
                (subHour) => subHour.startTime === assignment.startTime
              );
              const endIndex = flatSubHours.findIndex(
                (subHour) => subHour.endTime === assignment.endTime
              );
              const currentIndex = flatSubHours.findIndex((s) => s.startTime === subHour.startTime);

              return (
                assignment.day === day.format('YYYY-MM-DD') &&
                currentIndex > startIndex &&
                currentIndex <= endIndex
              );
            });

            if (isCellCovered) {
              return null;
            }
          }

          return (
            <td
              key={`${subHour.startTime}-${subHour.endTime}`}
              className="border p-2 w-25 cursor-pointer"
              onClick={() => {
                dispatch(setSelectedDay(day.format('YYYY-MM-DD')));
                dispatch(setSelectedStartTime(subHour.startTime));
                dispatch(setSelectedEndTime(subHour.endTime));
                (selectedGroupe || selectedFormateur) && dispatch(setShowAddAssignmentModal(true));
              }}
            ></td>
          );
        })
      )}
    </tr>
  );
};

export default DayRow;
