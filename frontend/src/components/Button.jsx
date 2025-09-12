import React from 'react';

const Button = ({ children, type = 'button', onClick, isLoading = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;