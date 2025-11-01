import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from './db.js';

export function attachSocket(server, { corsOrigin }) {
    
    const io = new Server(server, {
        cors: { origin: corsOrigin || 'http://localhost:5173', credentials: true }
    });

    async function authenticateSocket(socket) {
        try {
            let token = socket.handshake.auth?.token;
            if (!token && socket.handshake.headers.cookie) {
                const parsed = cookie.parse(socket.handshake.headers.cookie || '');
                token = parsed.token;
            }
            if (!token) return null;
            // strip Bearer if present
            if (token.startsWith && token.startsWith('Bearer ')) token = token.slice(7);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            return user || null;
        } catch (err) {
            return null;
        }
    }

    io.on('connection', (socket) => {
            console.log('New user connected:', socket.id);

            socket.on('joinRoom', async ({ boardId }) => {
                const user = await authenticateSocket(socket)
                if (!user) {
                    socket.emit('joinError', { message: 'Authentication failed' })
                    return
                }
                const board = await prisma.board.findUnique({ where: { id: Number(boardId) }})
                if (!board) {
                    socket.emit('joinError', { message: 'Board not found' })
                    return
                }

                const isOwner = board.authorId === user.id
                const isMember = await prisma.boardMember.findUnique({ 
                    where: { boardId_userId: { boardId: Number(boardId), userId: user.id } }
                });
                if (!isOwner && !isMember) {
                    socket.emit('joinError', { message: 'No access' });
                    return
                }
                socket.join(String(boardId));

                const events = await prisma.event.findMany({ 
                    where: { board_id: Number(boardId) },
                    orderBy: { createdAt: 'asc' }
                })
                socket.emit('initialEvents',  events );
                socket.to(String(boardId)).emit('userJoined', { userId: user.id, name: user.name})
            })

            socket.on('drawing', ({ boardId, eventData }) => {
                    socket.to(String(boardId)).emit('remoteDrawing', eventData)
            })

            socket.on('saveEvent', async ({ boardId, eventData }) => {
                try {
                    const user = await authenticateSocket(socket);
                    if (!user) return;
                    const saved = await prisma.event.create({
                        data: {
                            board_id: Number(boardId),
                            user_id: user.id,
                            event_type: eventData.type,
                            event_data: JSON.stringify(eventData)
                        }
                    });
                    io.to(String(boardId)).emit('eventSaved', { ...saved, eventData });
                } catch (error) {
                    console.error('saveEvent error:', error);
                    socket.emit('saveError', { message: 'Failed to save event' });
                }
            })

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                socket.to(String(boardId)).emit('userLeft', { userId: socket.id });
            });
    })
    return io
}