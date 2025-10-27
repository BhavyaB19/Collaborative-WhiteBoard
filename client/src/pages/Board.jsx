import line from '../assets/line.svg'
import pen from '../assets/pen.svg'
import square from '../assets/square.svg'
import circle from '../assets/circle.svg'
import eraser from '../assets/eraser.svg'
import menu from '../assets/menu.svg'
import sharelink from '../assets/sharelink.svg'
import { useRef, useState, useEffect } from 'react';
import Canvas from '../components/Canvas'
import { useParams } from 'react-router-dom'
import { boardEventService } from '../utils/boardEventService'
import { toast } from 'react-toastify';

const Board = () => {

  const canvasRef = useRef(null);
  const { boardId } = useParams();

  const [tool, setTool] = useState('pen');  
  const [mode, setMode] = useState("draw");
  const [history, setHistory] = useState([]);
  const [index, setIndex] = useState(-1);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (boardId) {
      loadBoardEvents()
    }
  }, [boardId])

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
      const eventData = event.event_data
      drawEvent(eventData)
    });
  }

  const drawEvent = async (eventData) => {
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

  const copyUrlLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
      });
  }

  return (
    <div className='bg-[#121212] h-screen flex flex-col'>
      {/* Navbar */}
      <div className='flex justify-between items-center px-5 mb-3'>

        <div className='text-white text-2xl h-11 bg-[#232329] relative top-7 font-bold flex justify-center items-center gap-4 rounded-sm hover:bg-gray-800 group'>
          <img src={menu} className='px-2 h-9' />
          <div className='hidden group-hover:block absolute top-full py-2 px-2 pr-5 left-0 bg-gray-800 border-1 border-gray-200 rounded'>
            <p className='text-sm font-normal mb-2 hover:scale-105' onClick={takeToDashboard}>Dashboard</p>
            <p className='text-sm font-normal mb-2 hover:scale-105'>Share Link</p>
            <p className='text-sm font-normal mb-2 hover:scale-105'>Settings</p>
          </div>
        </div>

        <div className='flex justify-center items-center gap-10'>
          <div className='text-white text-3xl h-11 bg-[#232329] relative top-7 font-bold flex justify-center items-center gap-4 rounded-sm '>
            <img src={pen} className='px-2  hover:scale-108 h-9' 
              onClick={() =>setTool('pen')}
            />
            <img src={line} className='px-2 h-9 hover:scale-108' 
              onClick={() => setTool('line')}
            />
            <img src={square} className='px-2 h-9 hover:scale-108'
              onClick={() => setTool('square')}
            />
            <img src={circle} className='px-2 h-9 hover:scale-108'
              onClick={() => setTool('circle')}
            />
            <img src={eraser} className='px-2 h-9 hover:scale-108'
              onClick={() => {
                setTool('eraser')
                setMode('erase')
              }}
            />
          </div>

          <div className='flex md:gap-4 sm:gap-3'>
            <button className='text-white text-md h-11 bg-[#232329] relative top-7 font-bold flex justify-center items-center gap-2 rounded-sm px-3 hover:bg-gray-800'
            onClick={undo}
            >
              Undo
            </button>
            <button className='text-white text-md h-11 bg-[#232329] relative top-7 font-bold flex justify-center items-center gap-2 rounded-sm px-3 hover:bg-gray-800'
            onClick={redo}
            >
              Redo
            </button>
            <button className='text-white text-md h-11 bg-[#232329] relative top-7 font-bold flex justify-center items-center gap-2 rounded-sm px-3 hover:bg-gray-800'
            onClick={clearCanvas}
            >
              Clear
            </button>
          </div>
        </div>

        <button className='bg-[#215AC8] text-white text-md h-10 relative top-7 font-bold flex justify-center items-center gap-2 rounded-sm px-3 hover:bg-blue-700' onClick={copyUrlLink}>
          Share Link
          <img src={sharelink} />
        </button>
      </div>

      <Canvas canvasRef={canvasRef} tool={tool} mode={mode} handleHistory={handleHistory} boardId={boardId} onEventSaved={handleEventSaved}/>
      
    </div>
  )
}

export default Board