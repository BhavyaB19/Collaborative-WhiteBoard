import React from 'react';
import user from '../assets/user.svg'

const Header = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">WhiteBoard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
              <img src={user} alt="User" className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
