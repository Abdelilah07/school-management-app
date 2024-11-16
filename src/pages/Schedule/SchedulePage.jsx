import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Clock, School, AlertCircle, Loader2 } from 'lucide-react';
import {
  fetchSchedule,
  setSelectedLevel,
  setSelectedClass,
  SCHEDULE_CONSTANTS,
} from '../../features/schedule/scheduleSlice';

const SelectionBox = ({ title, icon: Icon, value, options, onChange }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <div className="mb-3">
      <h3 className="text-lg font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <Icon className="w-5 h-5" />
        {title}
      </h3>
    </div>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
               focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      <option value="">Select {title}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const SchedulePage = () => {
  const dispatch = useDispatch();
  const { scheduleData, selectedLevel, selectedClass, loading, error } = useSelector(
    (state) => state.schedule
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimeSlot = () => {
    const currentDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const timeSlotIndex =
      SCHEDULE_CONSTANTS.timeSlots.findIndex((slot) => {
        const [start] = slot.split(' - ');
        const [startHour, startMinute] = start.split(':');
        const hour = parseInt(startHour);
        const minute = parseInt(startMinute);
        const slotTimeInMinutes = hour * 60 + minute;
        return currentTimeInMinutes < slotTimeInMinutes;
      }) - 1;

    return { currentDay, timeSlotIndex };
  };

  useEffect(() => {
    if (selectedLevel && selectedClass) {
      dispatch(fetchSchedule({ selectedClass, selectedLevel }));
    }
  }, [selectedLevel, selectedClass, dispatch]);

  const { currentDay, timeSlotIndex } = getCurrentTimeSlot();

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Class Schedule
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            {currentTime.toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectionBox
            title="Level"
            icon={School}
            value={selectedLevel}
            options={SCHEDULE_CONSTANTS.levels}
            onChange={(e) => dispatch(setSelectedLevel(e.target.value))}
          />
          <SelectionBox
            title="Class"
            icon={Calendar}
            value={selectedClass}
            options={SCHEDULE_CONSTANTS.classes}
            onChange={(e) => dispatch(setSelectedClass(e.target.value))}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          selectedLevel &&
          selectedClass && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Schedule for {selectedClass} - {selectedLevel}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="border border-gray-200 dark:border-gray-600 p-3 text-left min-w-[100px]">
                        Day / Time
                      </th>
                      {SCHEDULE_CONSTANTS.timeSlots.map((slot) => (
                        <th
                          key={slot}
                          className="border border-gray-200 dark:border-gray-600 p-3 text-left min-w-[150px] text-sm"
                        >
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SCHEDULE_CONSTANTS.days.map((day) => (
                      <tr
                        key={day}
                        className={`
                          ${day === currentDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                          hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                        `}
                      >
                        <td className="border border-gray-200 dark:border-gray-600 p-3 font-medium">
                          {day}
                        </td>
                        {scheduleData[day].map((slot, index) => (
                          <td
                            key={`${day}-${index}`}
                            className={`
                              border border-gray-200 dark:border-gray-600 p-3
                              ${slot === 'empty' ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
                              ${
                                day === currentDay && index === timeSlotIndex
                                  ? 'ring-2 ring-blue-500'
                                  : ''
                              }
                            `}
                          >
                            {slot !== 'empty' ? (
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded text-sm">
                                {slot}
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">No Class</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
