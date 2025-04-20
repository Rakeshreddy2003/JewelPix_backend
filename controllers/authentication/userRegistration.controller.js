import userModel from '../../models/user.model.js';
import Otp from '../../models/otp.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import sendEmail from '../../utils/mailer.js';

export const verifyUser = async (req, res) => {
    const { email} = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let otpRecord = await Otp.findOne({ email });
        if (!otpRecord) otpRecord = new Otp({ email });

        const otp = crypto.randomInt(100000, 999999);
        otpRecord.resetOtp = otp;
        otpRecord.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await otpRecord.save();

        await sendEmail(
            email,
            'OTP Verification - JewelPix',
            `Hello,

            You requested to register on JewelPix. Please use the OTP below to verify:

            🔹 OTP: ${otp}

            This OTP is valid for 10 minutes.

            Regards,  
            JewelPix Team`
        );
        // console.log(otp)
        res.status(201).json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
    }
};

export const CreateUser = async (req, res) => {
    const { userName, email, mobile, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord || otpRecord.resetOtp !== parseInt(otp)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (Date.now() > otpRecord.otpExpires) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const randomAvatar = `https://api.dicebear.com/9.x/micah/svg?seed=${crypto.randomBytes(4).toString('hex')}`;

        const newUser = new userModel({
            userName,
            email,
            mobile,
            userImage: randomAvatar
        });

        await newUser.save();
        await Otp.deleteOne({ email });

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ success: true, message: 'OTP verified, user created', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'OTP verification failed', error: err.message });
    }
};
