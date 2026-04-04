import React from 'react'
import { useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { useEffect } from 'react'
import axiosInstance from '../utils/helper'
import { useState } from 'react'

const InviteJoin = () => {
    const { inviteToken } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { userData, isLoading } = useContext(UserContext)
    const [joining, setJoining] = useState(false)

    useEffect(() => {
        // Wait for auth check to complete before deciding
        if (isLoading) return;

        if (!userData) {
            // Not logged in — redirect to login with return path
            navigate('/login', { state: { from: location.pathname } })
            return
        }

        // Already logged in — attempt to join
        if (joining) return; // prevent double-fire
        setJoining(true);

        const join = async () => {
            try {
                const { data } = await axiosInstance.post('/api/boards/invite/accept', { inviteToken })
                if (data.success) {
                    navigate(`/board/${data.data.boardId}`)
                } else {
                    const msg = data?.message || 'Failed to join board'
                    alert(msg)
                    navigate('/dashboard')
                }
            } catch (error) {
                alert(error.message)
                navigate('/dashboard')
            }
        }
        join()
    }, [inviteToken, userData, isLoading])

   return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900'>
      <div className='text-white text-lg flex items-center gap-3'>
        <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Joining board...
      </div>
    </div>
  )
}

export default InviteJoin
