import React, { useEffect, useState, useRef } from 'react'
import { boardEventService } from '../utils/boardEventService';

const Canvas = ({canvasRef, tool, mode, handleHistory, boardId, onEventSaved}) => {

    
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState(null);
    const [currentPath, setCurrentPath] = useState([]);
    const [eraserSize, setEraserSize] = useState(2);
    const [savedCanvasState, setSavedCanvasState] = useState(null);
    const [currentEvent, setCurrentEvent] = useState(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(rect.height * dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            const ctx = canvas.getContext("2d");
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }


        resize();
        const obs = new ResizeObserver(resize);
        obs.observe(canvas);
        return () => obs.disconnect();
        }, []
    );

    const getCtx = () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.getContext('2d');
    }

    const pushHistory = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const data = canvas.toDataURL('image/png');
        handleHistory(data);    
    }

    const getPosFromEvents = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    const saveEventToBackend = async (eventData) => {
        try {
            const result = await boardEventService.saveEvent(boardId, eventData.type, eventData)
            if (onEventSaved) {
                onEventSaved(result.data)
            }
        } catch (error) {
            console.error("Failed to save event:", error)
        }
    }

    const startDraw = (e) => {
        e.preventDefault()
        const ctx = getCtx()
        if (!ctx) return;
        setIsDrawing(true);
        const pos = getPosFromEvents(e);
        setStartPos(pos);

        if (tool === 'pen' || tool === 'eraser') {
            const eventData = {
              type: tool,
              startPos: pos,
              path: [pos]
            };
            setCurrentEvent(eventData);
        }
        // Save canvas state before starting shape
        if (tool === 'line' || tool === 'square' || tool === 'circle') {
            const canvas = canvasRef.current;
            const data = canvas.toDataURL('image/png');
            setSavedCanvasState(data);
        }

        if (tool === 'pen') {
            ctx.beginPath()
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.strokeStyle = "white" //mode === "draw" ? "white" : "black" Check this line afterwards
            ctx.moveTo(pos.x, pos.y)
        }  else if (tool === "eraser") {
            ctx.globalCompositeOperation = 'destination-out'
            ctx.beginPath()
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.lineWidth = eraserSize
            ctx.moveTo(pos.x, pos.y)
            setCurrentPath([pos])
        }
    }

    const moveDraw = (e) => {
        if (!isDrawing) return;
        e.preventDefault()
        const ctx = getCtx()
        if (!ctx) return;
        const pos = getPosFromEvents(e);

        if (currentEvent && (tool === 'pen' || tool === 'eraser')) {
            setCurrentEvent(prev => ({
              ...prev,
              path: [...prev.path, pos]
            }));
          }

        if (tool === 'pen') {
            ctx.lineTo(pos.x, pos.y)
            ctx.stroke()
        }  else if (tool === 'eraser') {
            ctx.lineTo(pos.x, pos.y)
            ctx.stroke()
        } else if (tool === 'line' || tool === 'square' || tool === 'circle') {
            // Restore saved state and draw dotted preview
            if (savedCanvasState) {
                const canvas = canvasRef.current;
                const dpr = window.devicePixelRatio || 1;
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
                    ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
                    
                    // Draw dotted preview
                    ctx.beginPath();
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]); // Dotted line
                    
                    if (tool === 'line') {
                        ctx.moveTo(startPos.x, startPos.y);
                        ctx.lineTo(pos.x, pos.y);
                    } else if (tool === 'square') {
                        ctx.rect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
                    } else if (tool === 'circle') {
                        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
                        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                    }
                    
                    ctx.stroke();
                    ctx.setLineDash([]); // Reset to solid line
                };
                img.src = savedCanvasState;
            }
        }
    }

    const endDraw = (e) => {
        if (!isDrawing) return;
        setIsDrawing(false);
        const ctx = getCtx()
        if (!ctx) return;

        // Save event to backend
        if (currentEvent && boardId) {
            saveEventToBackend(currentEvent);
            setCurrentEvent(null)
        }
        if (tool === "eraser") {
            ctx.globalCompositeOperation = 'source-over'
        }

        if(tool !== 'pen' && tool !== 'eraser' && startPos) {
            const pos = getPosFromEvents(e);
            const shapeEvent = {
                type: tool,
                startPos,
                endPos: pos
              };
              
              if (boardId) {
                saveEventToBackend(shapeEvent);
              }
            ctx.beginPath()
            ctx.strokeStyle = "white"
            if (tool === 'line') {
                ctx.moveTo(startPos.x, startPos.y)
                ctx.lineTo(pos.x, pos.y)
            } else if (tool === 'square') {
                ctx.rect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y)
            } else if (tool === 'circle') {
                const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2))
                ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
            }
            ctx.stroke()
        }
        ctx.closePath()
        setSavedCanvasState(null)
        pushHistory();
    }

  return (
    <>
        <canvas
        width={window.innerWidth }
        height={window.innerHeight - 100}
        onMouseDown={startDraw}
        onMouseMove={moveDraw}
        onMouseUp={endDraw} 
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={moveDraw}
        onTouchEnd={endDraw}
        ref={canvasRef} className='mt-10 ml-10 border-2 border-gray-600 bg-[#1E1E1E] m-10 rounded-lg cursor-crosshair'>
      
        </canvas>

    </>
    
  )
}

export default Canvas
