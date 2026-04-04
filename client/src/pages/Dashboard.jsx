import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import WelcomeSection from '../components/WelcomeSection';
import StatsCard from '../components/StatsCard';
import ActionBar from '../components/ActionBar';
import BoardsSection from '../components/BoardsSection';
import CreateBoardModal from '../components/CreateBoardModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom'; 
import axiosInstance from '../utils/helper.js';

const Dashboard = () => {

  const navigate = useNavigate()
  const {backendUrl, userData, setUserData, getUserData, setToken} = useContext(UserContext)

  const [boards, setBoards] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoard, setNewBoard] = useState({
    title: '',
    description: ''
  });


  const fetchAllBoards = async () => {
    try {
      const { data } = await axiosInstance.get('/api/boards/getboards');

      if (data.success) {
      setBoards(data.data);
      } else {
      toast.error(data.message);
    }
    } catch (error) {
      toast.error("Failed to fetch boards");
    } 
  }

  useEffect(() => {
    fetchAllBoards();
  }, [])

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/boards/create', {
        title: newBoard.title,
        content: newBoard.description
      })
      if (response.data.success) {
        const board = response.data.data;
        setBoards([board, ...boards]);
        setShowCreateModal(false);
        setNewBoard({ title: '', description: '' });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message
      toast.error(errorMessage);
    }
  }

  const toggleStar = (id) => {
    setBoards(boards.map(board => 
      board.id === id ? { ...board, isStarred: !board.isStarred } : board
    ));
  };

  const deleteBoard = async (id) => {
    try {
      const {data} = await axiosInstance.delete(`/api/boards/delete/${id}`);
      if (data?.success) {
        setBoards(boards.filter(board => board.id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete board");
    }
    //setBoards(boards.filter(board => board.id !== id));
  };

  const starredBoards = boards.filter(board => board.isStarred);

  const logout = async () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = null;
    setToken(null);
    setUserData(null);
    navigate('/login');
    toast.success("Logged out successfully");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header logout={logout}/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection />

        <ActionBar onCreateClick={() => setShowCreateModal(true)} />

        <BoardsSection 
          // title="All Boards"
          boards={boards}
          onToggleStar={toggleStar}
          onDelete={deleteBoard}
        />

        <CreateBoardModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBoard}
          newBoard={newBoard}
          setNewBoard={setNewBoard}
          // colors={colors}
        />

        <div className='flex justify-center'>
          <button className='mt-10 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition'
          onClick={logout}>
            Logout 
          </button>  
        </div>  

      </div>
      
    </div>
  );
};

export default Dashboard;
