import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import prisma from './db.js';
import userRouter from './routes/userRoute.js';
import boardRouter from './routes/boardRoute.js';
import jwt from 'jsonwebtoken';
import { attachSocket } from './socket.js';

const app = express();
const server = http.createServer(app);

const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: allowedOrigins}));

attachSocket(server, { corsOrigin: allowedOrigins[0] });

// API Endpoints
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/users', userRouter);  // Use the user routes
app.use('/api/boards', boardRouter)

const port = 7000;
server.listen(port, () => console.log(`Server is running on port ${port}`))



export default server 