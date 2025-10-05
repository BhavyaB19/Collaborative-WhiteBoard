import React from 'react';
import BoardCard from './BoardCard';

const BoardsSection = ({ title, boards, onToggleStar, onDelete, showStarIcon = false }) => {
  if (boards.length === 0) return null;

  return (
    <div className={showStarIcon ? "mb-8" : ""}>
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
        {showStarIcon && (
          <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map(board => (
          <BoardCard 
            key={board.id} 
            board={board} 
            onToggleStar={onToggleStar}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardsSection;
