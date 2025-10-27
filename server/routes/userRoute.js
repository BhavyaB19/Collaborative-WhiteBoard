import express from 'express';
import { signup, login, getUserDetails } from '../controllers/usercontroller.js';
import { protectedRoute } from '../middlewares/tokenVerify.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/getuserdata', protectedRoute, getUserDetails);


export default userRouter;