import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../../models/user.model.js';


// Login route
export const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {

        // Find user credentials in the user collection
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h"});

        return res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};
