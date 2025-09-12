import React from 'react';

const Input = ({ id, type = 'text', placeholder, value, onChange, ...props }) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
      {...props}
    />
  );
};

export default Input;