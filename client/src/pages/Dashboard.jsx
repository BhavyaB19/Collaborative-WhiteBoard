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
  const {backendUrl, userData, setUserData, getUserData} = useContext(UserContext)

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
        toast.error("yoyo")
      }
    } catch (error) {
      toast.error(error.message);
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

  // const statsData = [
  //   {
  //     icon: (
  //       <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  //       </svg>
  //     ),
  //     title: 'Total Boards',
  //     value: boards.length,
  //     color: 'bg-blue-500/20'
  //   },
  //   {
  //     icon: (
  //       <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
  //         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  //       </svg>
  //     ),
  //     title: 'Starred',
  //     value: starredBoards.length,
  //     color: 'bg-yellow-500/20'
  //   },
  //   {
  //     icon: (
  //       <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  //       </svg>
  //     ),
  //     title: 'Collaborators',
  //     value: boards.reduce((acc, board) => acc + board.collaborators, 0),
  //     color: 'bg-green-500/20'
  //   },
  //   {
  //     icon: (
  //       <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  //       </svg>
  //     ),
  //     title: 'Recent Activity',
  //     value: 12,
  //     color: 'bg-purple-500/20'
  //   }
  // ];

  const logout = async () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = null;
    setUserData(null);
    navigate('/login');
    toast.success("Logged out successfully");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header logout={logout}/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection />

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>  */}

        <ActionBar onCreateClick={() => setShowCreateModal(true)} />

        {/* <BoardsSection 
          title="Starred Boards"
          boards={starredBoards}
          onToggleStar={toggleStar}
          onDelete={deleteBoard}
          showStarIcon={true}
        /> */}

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
