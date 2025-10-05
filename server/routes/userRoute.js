import express from 'express';
import { signup, login, logout, getUserDetails } from '../controllers/usercontroller.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.get('/getuser', getUserDetails);

export default userRouter;