import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoardCard = ({ board, onToggleStar, onDelete }) => {

  const navigate = useNavigate();

  const takeToBoard = () => {
    navigate(`/board/${board.id}`);
  }
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group cursor-pointer"
    onClick={takeToBoard}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 bg-indigo-700 rounded-lg flex items-center justify-center`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleStar(board.id)
             }
            }
            className={`p-2 rounded-lg transition-colors ${
              board.isStarred 
                ? 'text-yellow-400 hover:bg-yellow-400/20' 
                : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/20'
            }`}
          >
            <svg className="w-4 h-4" fill={board.isStarred ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(board.id)
             }
            }
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <h5 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
        {board.title}
      </h5>
      <p className="text-gray-400 text-sm mb-4">{board.content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Modified {board.updatedAt}</span>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {/* <span>{board.collaborators}</span> */}
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
