import React from 'react';

const ActionBar = ({ onCreateClick }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-xl font-semibold text-white">Your Boards</h3>
      <button
        onClick={onCreateClick}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Create New Board</span>
      </button>
    </div>
  );
};

export default ActionBar;
