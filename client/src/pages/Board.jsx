import line from '../assets/line.svg'
import pen from '../assets/pen.svg'
import square from '../assets/square.svg'
import circle from '../assets/circle.svg'
import eraser from '../assets/eraser.svg'
import menu from '../assets/menu.svg'
import sharelink from '../assets/sharelink.svg'
import { useRef, useState, useEffect, useContext } from 'react';
import Canvas from '../components/Canvas'
import { useParams } from 'react-router-dom'
import { boardEventService } from '../utils/boardEventService'
import { toast } from 'react-toastify';
import axiosInstance from '../utils/helper'
import { io } from 'socket.io-client';
import { UserContext } from '../context/UserContext'

const Board = () => {

  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(true);

  const { boardId } = useParams();
  const { userData, backendUrl }= useContext(UserContext)

  const [tool, setTool] = useState('pen');  
  const [mode, setMode] = useState("draw");
  const [history, setHistory] = useState([]);
  const [index, setIndex] = useState(-1);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (boardId) {
      loadBoardEvents()
    }
  }, [boardId])

  const connectSocket = () => {
    let sock = socketRef.current;
    const alreadyConnected = sock && sock.connected;

    // Create a new socket only if one doesn't exist yet
    if (!sock) {
      const token = localStorage.getItem('token');
      sock = io(backendUrl, {
        auth: { token },
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });
      socketRef.current = sock;
    }

    // Always clear old listeners first to avoid duplicates
    sock.off('connect');
    sock.off('joinError');
    sock.off('initialEvents');
    sock.off('reconnect');
    sock.off('connect_error');
    sock.off('eventSaved');
    sock.off('activeUsers');
    sock.off('disconnect');

    let initialEventsReceived = false;
    let fallbackTimer = null;

    const startFallbackTimer = () => {
      clearTimeout(fallbackTimer);
        fallbackTimer = setTimeout(async () => {
          if (!initialEventsReceived) {
            console.warn('Board: initialEvents not received, falling back to HTTP load');
            try {
              const result = await boardEventService.getEvents(boardId);
              if (result?.success) {
                setEvents(result.data || []);
              }
            } catch (err) {
              console.error('Board: fallback load failed', err);
            }
          }
      }, 1500);
   };

    sock.on('connect', () => {
      console.log('Connected to server', sock.id);
      setSocket(sock);
      setIsSocketReady(true);
      setIsCollaborating(true);
      sock.emit('joinRoom', { boardId });
      startFallbackTimer();
    });

    sock.on('joinError', (err) => {
      console.error('joinError', err);
    });

    sock.on('initialEvents', (events) => {
      initialEventsReceived = true;
      clearTimeout(fallbackTimer);
      console.log('Board: received initialEvents', events?.length ?? 0);
      setEvents(events || []);
      if (events && events.length > 0) {
        replayEvents(events);
      }
    });

    sock.on('reconnect', (attempt) => {
      console.log('Reconnected to server on attempt:', attempt);
      if (boardId) sock.emit('joinRoom', { boardId });
      startFallbackTimer();     
    })

    sock.on('connect_error', (err) => {
      console.error('Board: socket connect_error', err);
      (async () => {
        try {
          const result = await boardEventService.getEvents(boardId);
          if (result?.success) setEvents(result.data || []);
        } catch (e) {
          console.error('Board: http fallback failed', e);
        }
      })();
    });

    sock.on('eventSaved', (data) => {
      setEvents(prev => {
        if (!data) return prev;
        const exists = prev.find(e => e.id === data.id);
        if (exists) return prev;
        return [...prev, data];
      });
    });

    sock.on('activeUsers', (users) => {
      console.log('Active users updated:', users);
      setActiveUsers(users || []);
    });
    
    sock.on('disconnect', (reason) => {
      console.log('Disconnected from server', reason);
      setIsSocketReady(false);
      if (reason === 'io client disconnect') {
        setSocket(null);
        setActiveUsers([]);
        setIsCollaborating(false);
      }
    })

    // If already connected, join room immediately; otherwise wait for 'connect' event
    if (alreadyConnected) {
      setSocket(sock);
      setIsSocketReady(true);
      setIsCollaborating(true);
      sock.emit('joinRoom', { boardId });
    }

    startFallbackTimer();

    return fallbackTimer;
  };

  useEffect(() => {
    if (!boardId || !userData) return;

    const fallbackTimer = connectSocket();

    return () => {
      clearTimeout(fallbackTimer);
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('initialEvents');
        socketRef.current.off('reconnect');
        socketRef.current.off('connect_error');
        socketRef.current.off('eventSaved');
        socketRef.current.off('activeUsers');
        socketRef.current.off('disconnect');
        // Don't disconnect on cleanup — let reconnection handle page refresh
      }
    }
  }, [boardId, userData, backendUrl]);

  const loadBoardEvents = async () => {
    setIsLoading(true)
    try {
      const result = await boardEventService.getEvents(boardId)
      if (result.success) {
        setEvents(result.data)
        replayEvents(result.data)
      }
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const replayEvents = async (events) => {  
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    events.forEach(event => {
      const eventData = typeof event.event_data === 'string'? JSON.parse(event.event_data) : event.event_data;
      drawEvent(eventData)
    });
  }

  const drawEvent = async (eventData) => {
    const data = typeof eventData === 'string' ? JSON.parse(eventData) : eventData
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (eventData.type === 'pen') {
      ctx.beginPath()
      ctx.moveTo(eventData.path[0].x, eventData.path[0].y)
      eventData.path.forEach(point => {
        ctx.lineTo(point.x, point.y)
      });
      ctx.stroke()
    } else if (eventData.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(eventData.startPos.x, eventData.startPos.y);
      ctx.lineTo(eventData.endPos.x, eventData.endPos.y);
      ctx.stroke();
    } else if (eventData.type === 'square') {
      ctx.beginPath()
      ctx.rect(eventData.startPos.x, eventData.startPos.y, eventData.endPos.x - eventData.startPos.x, eventData.endPos.y - eventData.startPos.y)
      ctx.stroke()
    } else if (eventData.type === 'circle') {
      ctx.beginPath()
      const radius = Math.sqrt(Math.pow(eventData.endPos.x - eventData.startPos.x, 2) + Math.pow(eventData.endPos.y - eventData.startPos.y, 2))
      ctx.arc(eventData.startPos.x, eventData.startPos.y, radius, 0, 2*Math.PI)
      ctx.stroke()
    }
    
  }

  const handleEventSaved = (savedEvent) => {
    setEvents(prev => [...prev, savedEvent])
  }

  const handleHistory = (newData) => {
    let newStack = history.slice(0, index + 1);
    newStack.push(newData);
    setHistory(newStack);
    setIndex(newStack.length - 1);
  }

  const restoreFromHistory = (data) => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rect = canvas.getBoundingClientRect()
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    }
    img.src = data;
  }

  const undo = () => {
    if (index <= 0) return;
    setIndex(index - 1);
    restoreFromHistory(history[index - 1]);
  }

  const redo = () => {
    if (index > history.length - 1) return;
    setIndex(index + 1);
    restoreFromHistory(history[index + 1]);
  }

  const clearCanvas = async () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setIndex(-1);

    if (boardId) {
      try {
        await boardEventService.clearEvents(boardId);
        setEvents([]);
      } catch (error) {
        console.error('Failed to clear events:', error);
      }
    }
  }

  const takeToDashboard = () => {
    window.location.href = '/dashboard'
  }

  const handleShare = async (boardId) => {
    try {
      const { data } = await axiosInstance.post(`/api/boards/${boardId}/invite`)
      if (data.success) {
        const link = data.data.link
        await navigator.clipboard.writeText(link)
        toast.success("Invite link copied to clipboard!")
      } else {
        toast.error(data.message || "Failed to generate invite link") 
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleLeaveCollaboration = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setSocket(null);
    setIsSocketReady(false);
    setIsCollaborating(false);
    setActiveUsers([]);
    toast.info("Left collaborative mode — working offline");
  }

  const handleRejoinCollaboration = () => {
    connectSocket();
    toast.success("Rejoining collaborative session...");
  }

  const activeTool = tool;

  return (
    <div className='bg-[#121212] h-screen flex flex-col overflow-hidden'>
      {/* Navbar */}
      <div className='flex justify-between items-center px-4 py-3 flex-shrink-0'>

        <div className='text-white text-2xl h-10 bg-[#232329] font-bold flex justify-center items-center gap-4 rounded-lg hover:bg-[#2a2a32] group relative'>
          <img src={menu} className='px-2.5 h-8' />
          <div className='hidden group-hover:block absolute top-full py-2 px-2 pr-5 left-0 bg-[#2a2a32] border border-gray-700 rounded-lg mt-1 z-50 shadow-xl'>
            <p className='text-sm font-normal mb-2 hover:text-blue-400 cursor-pointer transition-colors' onClick={takeToDashboard}>Dashboard</p>
            <p className='text-sm font-normal mb-2 hover:text-blue-400 cursor-pointer transition-colors'>Share Link</p>
            <p className='text-sm font-normal mb-2 hover:text-blue-400 cursor-pointer transition-colors'>Settings</p>
          </div>
        </div>

        <div className='flex justify-center items-center gap-6'>
          <div className='text-white text-3xl h-10 bg-[#232329] font-bold flex justify-center items-center gap-1 rounded-lg px-1'>
            <button 
              className={`px-2 h-9 rounded-md transition-colors ${activeTool === 'pen' ? 'bg-blue-500/20' : 'hover:bg-white/5'}`}
              onClick={() => setTool('pen')}
            >
              <img src={pen} className='h-7' />
            </button>
            <button 
              className={`px-2 h-9 rounded-md transition-colors ${activeTool === 'line' ? 'bg-blue-500/20' : 'hover:bg-white/5'}`}
              onClick={() => setTool('line')}
            >
              <img src={line} className='h-7' />
            </button>
            <button 
              className={`px-2 h-9 rounded-md transition-colors ${activeTool === 'square' ? 'bg-blue-500/20' : 'hover:bg-white/5'}`}
              onClick={() => setTool('square')}
            >
              <img src={square} className='h-7' />
            </button>
            <button 
              className={`px-2 h-9 rounded-md transition-colors ${activeTool === 'circle' ? 'bg-blue-500/20' : 'hover:bg-white/5'}`}
              onClick={() => setTool('circle')}
            >
              <img src={circle} className='h-7' />
            </button>
            <button 
              className={`px-2 h-9 rounded-md transition-colors ${activeTool === 'eraser' ? 'bg-red-500/20' : 'hover:bg-white/5'}`}
              onClick={() => {
                setTool('eraser')
                setMode('erase')
              }}
            >
              <img src={eraser} className='h-7' />
            </button>
          </div>

          <div className='flex gap-2'>
            <button className='text-white text-sm h-10 bg-[#232329] font-medium flex justify-center items-center gap-2 rounded-lg px-3 hover:bg-[#2a2a32] transition-colors'
            onClick={undo}
            >
              Undo
            </button>
            <button className='text-white text-sm h-10 bg-[#232329] font-medium flex justify-center items-center gap-2 rounded-lg px-3 hover:bg-[#2a2a32] transition-colors'
            onClick={redo}
            >
              Redo
            </button>
            <button className='text-white text-sm h-10 bg-[#232329] font-medium flex justify-center items-center gap-2 rounded-lg px-3 hover:bg-[#2a2a32] transition-colors'
            onClick={clearCanvas}
            >
              Clear
            </button>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {/* Collaboration toggle */}
          {isCollaborating ? (
            <button
              onClick={handleLeaveCollaboration}
              className='text-white text-sm h-10 bg-red-500/10 border border-red-500/30 font-medium flex justify-center items-center gap-2 rounded-lg px-4 hover:bg-red-500/20 transition-colors'
              title="Leave collaborative session and work offline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Leave
            </button>
          ) : (
            <button
              onClick={handleRejoinCollaboration}
              className='text-white text-sm h-10 bg-emerald-500/10 border border-emerald-500/30 font-medium flex justify-center items-center gap-2 rounded-lg px-4 hover:bg-emerald-500/20 transition-colors'
              title="Rejoin collaborative session"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Rejoin
            </button>
          )}

          <button className='bg-blue-500 text-white text-sm h-10 font-semibold flex justify-center items-center gap-2 rounded-lg px-4 hover:bg-blue-400 transition-colors' onClick={() => handleShare(boardId)}>
            Share
            <img src={sharelink} className="h-4" />
          </button>
        </div>
      </div>

      {/* Canvas takes remaining space */}
      <Canvas canvasRef={canvasRef} tool={tool} mode={mode} handleHistory={handleHistory} boardId={boardId} onEventSaved={handleEventSaved} socket={socket} isCollaborating={isCollaborating}/>
      
      {/* Active Users / Status Bar */}
      <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'>
        {isCollaborating && activeUsers.length > 0 ? (
          <div className='bg-[#232329]/95 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-lg border border-white/10'>
            <div className='flex items-center gap-3'>
              <div className='flex -space-x-2'>
                {activeUsers.slice(0, 5).map((user) => (
                  <div key={user.socketId} className='w-7 h-7 rounded-full bg-blue-500/40 border-2 border-[#232329] flex items-center justify-center text-xs font-medium'>
                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                ))}
                {activeUsers.length > 5 && (
                  <div className='w-7 h-7 rounded-full bg-white/10 border-2 border-[#232329] flex items-center justify-center text-xs font-medium'>
                    +{activeUsers.length - 5}
                  </div>
                )}
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse'></div>
                <span className='text-xs text-white/60'>{activeUsers.length} online</span>
              </div>
            </div>
          </div>
        ) : !isCollaborating ? (
          <div className='bg-[#232329]/95 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-lg border border-orange-500/20'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-orange-400 rounded-full'></div>
              <span className='text-xs text-white/60'>Offline mode — drawings are local only</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Board