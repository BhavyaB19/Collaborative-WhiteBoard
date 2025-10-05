import React from 'react';

const CreateBoardModal = ({ isOpen, onClose, onSubmit, newBoard, setNewBoard, colors }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-6">Create New Board</h3>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Board Title</label>
            <input
              type="text"
              value={newBoard.title}
              onChange={(e) => setNewBoard({...newBoard, title: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
              placeholder="Enter board title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <textarea
              value={newBoard.description}
              onChange={(e) => setNewBoard({...newBoard, description: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300 resize-none"
              placeholder="Enter board description"
              rows={3}
            />
          </div>
          {/* <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Board Color</label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewBoard({...newBoard, color})}
                  className={`w-12 h-12 ${color} rounded-lg border-2 ${
                    newBoard.color === color ? 'border-white' : 'border-gray-600'
                  } hover:scale-110 transition-transform duration-200`}
                />
              ))}
            </div>
          </div> */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
