
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel from '../models/user.model.js'; // Import user model to get user details
dotenv.config();

export const protect = async (req, res, next) => {
    // Get token from the request header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded._id).select('-password'); // Attach user data to req
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
