import line from '../assets/line.svg'
import pen from '../assets/pen.svg'
import square from '../assets/square.svg'
import circle from '../assets/circle.svg'
import eraser from '../assets/eraser.svg'
import menu from '../assets/menu.svg'
import { useRef, useState, useEffect } from 'react';
import Canvas from '../components/Canvas'


const Board = () => {

  const canvasRef = useRef(null);

  const [tool, setTool] = useState('pen');  
  const [mode, setMode] = useState("draw");
  const [history, setHistory] = useState([]);
  const [index, setIndex] = useState(-1);

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

  const clearCanvas = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setIndex(-1);
  }

  return (
    <div className='bg-[#121212] h-screen flex flex-col'>
      {/* Navbar */}
      <div className='flex justify-between items-center px-5 mb-3'>

        <div className='text-white text-3xl h-13 bg-[#232329] relative top-7 font-bold flex justify-center items-center gap-4 rounded-sm hover:bg-gray-800 '>
          <img src={menu} className='px-4 h-9' />
        </div>

        <div className='text-white text-3xl h-13 bg-[#232329] relative top-7 font-bold flex justify-center items-center gap-4 rounded-sm '>
          <img src={pen} className='px-4  hover:bg-gray-800 h-9' 
          onClick={() =>setTool('pen')}
          />
          <img src={line} className='px-4 h-9  hover:bg-gray-800' 
          onClick={() => setTool('line')}
          />
          <img src={square} className='px-4 h-9  hover:bg-gray-800'
          onClick={() => setTool('square')}
          />
          <img src={circle} className='px-4 h-9  hover:bg-gray-800'
          onClick={() => setTool('circle')}
          />
          <img src={eraser} className='px-4 h-9  hover:bg-gray-800'
          onClick={() => {
            setTool('eraser')
            setMode('erase')
          }}
          />
        </div>

        <div className='flex md:gap-4 sm:gap-3'>
          <button className='text-white text-lg h-10 bg-[#232329] relative top-7 font-bold flex justify-center items-center gap-4 rounded-sm px-4 hover:bg-gray-800'
          onClick={undo}
          >
            Undo
          </button>
          <button className='text-white text-lg h-10 bg-[#232329] relative top-7 font-bold flex justify-center items-center gap-4 rounded-sm px-4 ml-4 hover:bg-gray-800'
          onClick={redo}
          >
            Redo
          </button>
          <button className='text-white text-lg h-10 bg-[#232329] relative top-7 font-bold flex justify-center items-center gap-4 rounded-sm px-4 ml-4 hover:bg-gray-800'
          onClick={clearCanvas}
          >
            Clear
          </button>
        </div>
      </div>

      <Canvas canvasRef={canvasRef} tool={tool} mode={mode} handleHistory={handleHistory}/>
      
    </div>
  )
}

export default Board