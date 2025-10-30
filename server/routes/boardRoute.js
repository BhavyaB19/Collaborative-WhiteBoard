import express from 'express';
import { createWhiteboard, getAllBoards, getBoardById, updateWhiteboard, deleteWhiteboard, saveDrawingEvent, getBoardEvents, clearBoardEvents, createInvite, acceptInvite } from '../controllers/boardController.js';
import { protectedRoute } from '../middlewares/tokenVerify.js';

const boardRouter = express.Router();

boardRouter.post('/create',protectedRoute, createWhiteboard)
boardRouter.get('/getboards', protectedRoute, getAllBoards)
boardRouter.get('/getboards/:boardId', protectedRoute, getBoardById)
boardRouter.put('/update/:boardId', protectedRoute, updateWhiteboard)
boardRouter.delete('/delete/:boardId', protectedRoute, deleteWhiteboard)

boardRouter.post('/:boardId/events', protectedRoute, saveDrawingEvent)
boardRouter.get('/:boardId/events', protectedRoute, getBoardEvents)
boardRouter.delete('/:boardId/events', protectedRoute, clearBoardEvents)

boardRouter.post('/:boardId/invite', protectedRoute, createInvite)
boardRouter.post('/invite/accept', protectedRoute, acceptInvite)

export default boardRouter;


