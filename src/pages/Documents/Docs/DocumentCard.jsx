import React from 'react';

const DocumentCard = ({ type, Icon, label, isSelected, onClick }) => (
  <button
    onClick={() => onClick(type)}
    className={`p-3 rounded-md border transition-colors duration-150 flex flex-col items-center space-y-1
      ${
        isSelected
          ? 'border-green-500 bg-green-50 dark:border-green-300 dark:bg-green-900'
          : 'border-gray-300 hover:border-green-400 hover:bg-green-50 dark:border-gray-600 dark:hover:border-green-500 dark:hover:bg-green-800'
      }`}
  >
    <Icon
      className={`w-5 h-5 ${isSelected ? 'text-green-500 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}
    />
    <span
      className={`font-semibold ${isSelected ? 'text-green-500 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}
    >
      {label}
    </span>
  </button>
);

export default DocumentCard;
