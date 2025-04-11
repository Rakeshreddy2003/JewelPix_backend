import userData from '../../models/user.model.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Otp from '../../models/otp.js';
import sendEmail from '../../utils/mailer.js';

export const userPasswordUpdate = async (req, res) => {
    const { email } = req.body;
    try {

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Find user by email
        const user = await userData.findOne({ email });

        if (!user) {
            return res.status(400).send('User not found');
        }

        // Find or create OTP record
        let otpRecord = await Otp.findOne({ userId: user._id });

        if (!otpRecord) {
            otpRecord = new Otp({ userId: user._id }); // Create a new OTP record if it doesn't exist
        }

        const otp = crypto.randomInt(100000, 999999);
        otpRecord.resetOtp = otp;
        otpRecord.otpExpires = Date.now() + 600000; // 1 hour
        await otpRecord.save();

        await sendEmail(
            email,
            'Reset Your Password - OTP Verification',
            `Hello,
        
            You have requested to reset your password. Please use the following One-Time Password (OTP) to complete the process:
        
            🔹 OTP: ${otp}
        
            This OTP is valid for **10 minutes**. If you did not request this, please ignore this email.
        
            Best regards,  
            JewelPix Team`
        );

        res.status(201).json({ success: true, message: 'OTP sent to email' });

    } catch (err) {
        console.error("OTP error:", err);
        res.status(500).json({ message: "Error sending OTP", error: err.message });
    }
};


export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await userData.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const otpRecord = await Otp.findOne({ userId: user._id });
        if (!otpRecord || otpRecord.resetOtp !== parseInt(otp, 10)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (Date.now() > otpRecord.otpExpires) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        await Otp.deleteOne({ userId: user._id });

        return res.json({ success: true, message: 'OTP verified', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



//reset password

export const userResetPassword = async (req, res) => {
    try {
        const { password } = req.body;

        const userId = req.user.userId;

        if (!validator.isLength(password, { min: 8 })) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one lowercase letter.' });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one uppercase letter.' });
        }
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one number.' });
        }
        if (!/[\W_]/.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one special character.' });
        }

        const user = await userData.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        return res.json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

