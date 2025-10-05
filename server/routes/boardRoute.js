import express from 'express';
import { createWhiteboard, getAllBoards, getBoardById, updateWhiteboard, deleteWhiteboard } from '../controllers/boardController.js';
import { protectedRoute } from '../middlewares/tokenVerify.js';

const boardRouter = express.Router();

boardRouter.post('/create', createWhiteboard)
boardRouter.get('/getboards', getAllBoards)
boardRouter.get('/getboards/:boardId', protectedRoute, getBoardById)
boardRouter.put('/update/:boardId', protectedRoute, updateWhiteboard)
boardRouter.delete('/delete/:boardId', protectedRoute, deleteWhiteboard)

export default boardRouter;


