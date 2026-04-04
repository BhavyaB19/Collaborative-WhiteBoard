import React, { useEffect, useState, useRef, useCallback } from 'react'
import { boardEventService } from '../utils/boardEventService';

const Canvas = ({canvasRef, tool, mode, handleHistory, boardId, onEventSaved, socket, isCollaborating}) => {

    
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState(null);
    const [currentPath, setCurrentPath] = useState([]);
    const [eraserSize, setEraserSize] = useState(2);
    const [savedCanvasState, setSavedCanvasState] = useState(null);
    const [currentEvent, setCurrentEvent] = useState(null);
    
    // Ref to store the latest events for replay on resize
    const eventsRef = useRef([]);

    // Expose a method to update eventsRef from parent
    useEffect(() => {
        // Parent passes events implicitly through re-renders;
        // we'll update eventsRef via a callback in replayEvents
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas buffer size to match its CSS display size
        const setCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;

            // Save current canvas content before resize
            let imageData = null;
            const oldWidth = canvas.width;
            const oldHeight = canvas.height;
            if (oldWidth > 0 && oldHeight > 0) {
                try {
                    const ctx = canvas.getContext('2d');
                    imageData = ctx.getImageData(0, 0, oldWidth, oldHeight);
                } catch (e) {
                    // Canvas may be empty, ignore
                }
            }

            // Read the canvas's CSS-computed display size
            const rect = canvas.getBoundingClientRect();
            const newWidth = Math.floor(rect.width * dpr);
            const newHeight = Math.floor(rect.height * dpr);

            // Only resize if dimensions actually changed
            if (canvas.width === newWidth && canvas.height === newHeight) return;

            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext("2d");
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Restore content after resize
            if (imageData && oldWidth > 0 && oldHeight > 0) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = oldWidth;
                tempCanvas.height = oldHeight;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.putImageData(imageData, 0, 0);

                // Draw old content scaled to new display size
                ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height);
            }
        };

        setCanvasSize();

        const container = canvas.parentElement;
        const obs = new ResizeObserver(() => {
            setCanvasSize();
        });
        obs.observe(container || canvas);

        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!socket || !boardId) {
            return;
        }

        console.log('Canvas: Setting up socket listeners');

        // Listen for remote drawing from other users
        socket.on('remoteDrawing', (eventData) => {
            console.log('Canvas: Received remoteDrawing', eventData);
            drawEventOnCanvas(eventData);
        });

        return () => {
            socket.off('remoteDrawing');
        };
    }, [socket, boardId]);

    const replayEvents = (events) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        events.forEach(event => {
            const eventData = typeof event.event_data === 'string' 
                ? JSON.parse(event.event_data) 
                : event.event_data;
            drawEventOnCanvas(eventData);
        });
    };

    const drawEventOnCanvas = (eventData) => {
        const ctx = getCtx();
        if (!ctx) return;

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (eventData.type === 'pen') {
            ctx.beginPath();
            ctx.moveTo(eventData.path[0].x, eventData.path[0].y);
            eventData.path.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        } else if (eventData.type === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = eraserSize;
            ctx.beginPath();
            ctx.moveTo(eventData.path[0].x, eventData.path[0].y);
            eventData.path.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
        } else if (eventData.type === 'line') {
            ctx.beginPath();
            ctx.moveTo(eventData.startPos.x, eventData.startPos.y);
            ctx.lineTo(eventData.endPos.x, eventData.endPos.y);
            ctx.stroke();
        } else if (eventData.type === 'square') {
            ctx.beginPath();
            ctx.rect(eventData.startPos.x, eventData.startPos.y, 
                     eventData.endPos.x - eventData.startPos.x, 
                     eventData.endPos.y - eventData.startPos.y);
            ctx.stroke();
        } else if (eventData.type === 'circle') {
            ctx.beginPath();
            const radius = Math.sqrt(
                Math.pow(eventData.endPos.x - eventData.startPos.x, 2) + 
                Math.pow(eventData.endPos.y - eventData.startPos.y, 2)
            );
            ctx.arc(eventData.startPos.x, eventData.startPos.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    };

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
        // Only emit via socket if collaborating and socket is connected
        if (!socket || !boardId || !isCollaborating || !socket.connected) return;

        console.log('Canvas: Emitting drawing event', eventData);

        // Emit to socket for real-time broadcasting to other users
        socket.emit('drawing', {
            boardId,
            eventData
        });

        // Save to database
        socket.emit('saveEvent', {
            boardId,
            eventData
        });
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
        
        if (tool === 'line' || tool === 'square' || tool === 'circle') {
            const canvas = canvasRef.current;
            const data = canvas.toDataURL('image/png');
            setSavedCanvasState(data);
        }

        if (tool === 'pen') {
            ctx.beginPath()
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.strokeStyle = "white"
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
            if (savedCanvasState) {
                const canvas = canvasRef.current;
                const dpr = window.devicePixelRatio || 1;
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
                    ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
                    
                    ctx.beginPath();
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    
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
                    ctx.setLineDash([]);
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

        const pos = getPosFromEvents(e);

        // Save pen/eraser strokes
        if (currentEvent && boardId) {
            saveEventToBackend(currentEvent);
            setCurrentEvent(null)
        }
        
        if (tool === "eraser") {
            ctx.globalCompositeOperation = 'source-over'
        }

        // Save shapes (line, square, circle)
        if(tool !== 'pen' && tool !== 'eraser' && startPos) {
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
            ctx.lineWidth = 2;
            
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
    <div className="flex-1 min-h-0 px-4 pb-4 overflow-hidden">
        <canvas
            onMouseDown={startDraw}
            onMouseMove={moveDraw}
            onMouseUp={endDraw} 
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={moveDraw}
            onTouchEnd={endDraw}
            ref={canvasRef} 
            className='border border-gray-700 bg-[#1E1E1E] rounded-lg cursor-crosshair'
            style={{ display: 'block', width: '100%', height: '100%', boxSizing: 'border-box' }}
        >
        </canvas>
    </div>
    
  )
}

export default Canvas
