import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  resetOtp: { type: Number, required: true },
  email: { type: String, required: true},
  otpExpires: { type: Date, required: true }
}, { timestamps: true });

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
