import React from 'react';

const FormInput = ({ label, type = 'text', ...props }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-lg font-semibold text-gray-400">{label}</label>
    <input
      type={type}
      className="w-full bg-transparent px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
      {...props}
    />
  </div>
);

export default FormInput;
