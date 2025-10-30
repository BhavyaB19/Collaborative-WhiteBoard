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
    const { userData } = useContext(UserContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const join = async () => {
            if (!userData) {
                navigate('/login', { state: { from: location.pathname } })
                return
            }
            try {
                const { data } = await axiosInstance.post('/api/boards/invite/accept', { inviteToken })
                if (data.success) {
                    navigate(`/board/${data.data.boardId}`)
                } else {
                    const msg = data?.message || 'Failed to join board (server returned success: false)'
                    console.log(`${msg}\n\nServer response:\n${JSON.stringify(data, null, 2)}`)
                    alert(data?.message || 'Failed to join board')
                    navigate('/dashboard')
                }
            } catch (error) {
                alert(error.message)
                navigate('/dashboard')
            } finally {
                setLoading(false)
            }
        }
        join()
    }, [inviteToken, userData])

   return (
    <div>
      {loading ? "Joining..." : "Join"}
    </div>
  )
}

export default InviteJoin
