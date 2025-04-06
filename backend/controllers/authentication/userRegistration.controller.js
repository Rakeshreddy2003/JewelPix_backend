import bcrypt from 'bcrypt';
import userModel from '../../models/user.model.js';

export const registerUser = async (req, res) => {
    const { userName, email, password, mobile } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ userName, email, mobile, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to create user', error: err.message });
    }
};
