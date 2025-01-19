import React from 'react';

const SelectionToggle = ({ icon: Icon, label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2
      ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:border-blue-300 dark:bg-blue-900'
          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-800'
      }`}
  >
    <Icon
      className={`w-5 h-5 ${isSelected ? 'text-blue-500 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}
    />
    <span
      className={`font-medium ${isSelected ? 'text-blue-500 dark:text-blue-300' : 'text-gray-700 dark:text-gray-400'}`}
    >
      {label}
    </span>
  </button>
);

export default SelectionToggle;
