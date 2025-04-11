import mongoose from "mongoose";

const ProtectionSchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "PatentApplication", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    // reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin ID
    approvalDate: { type: Date }
  }, { timestamps: true });
  
  const ProtectionModel = mongoose.model('ProtectionModel', ProtectionSchema);
  export default ProtectionModel;