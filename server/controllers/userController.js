import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'None' : 'Lax',
  path: '/',
};

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

    try {
        const existingUser = await prisma.user.findFirst( {where: {email}} );
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
        data: {
            name: name, email: email, password_hash: hashedPassword
        }
        });
        
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, cookieOptions);
        return res.status(201).json({ success: true, message: 'User created successfully.', token });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hash)
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid password.' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, cookieOptions);
        return res.json({ success: true, message: 'Login successful.', token });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None', path: '/' });
        return res.json({ success: true, message: 'Logout successful.' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getUserDetails = async (req, res) => {
    try {
        const {email} = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const updatedUser = await prisma.user.update({  
            where: { email: email },
            data: { isAuthenticated: true },
            select: { id: true, name: true, email: true, isAuthenticated: true },
        });
        return res.json({ success: true, data: updatedUser });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}