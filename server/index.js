import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import prisma from './db.js';
import userRouter from './routes/userRoute.js';
import boardRouter from './routes/boardRoute.js';
import { Server } from 'socket.io';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})

const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: allowedOrigins}));

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('join-board', async ({ boardId, userId }) => {
        socket.join(`board-${boardId}`);
        console.log(`User ${userId} joined board-${boardId}`);
    })

    socket.on('draw-event', async (data) => {
        const { boardId, event } = data;
        // await prisma.boardEvent.create({})
        
        socket.to(`board-${boardId}`).emit('receive-event', event);
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    })
})

// API Endpoints
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/users', userRouter);  // Use the user routes
app.use('/api/boards', boardRouter)

const port = 7000;
server.listen(port, () => console.log(`Server is running on port ${port}`))



export default server 