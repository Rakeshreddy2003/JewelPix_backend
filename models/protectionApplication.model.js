import mongoose from "mongoose";

const ProtectionApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    designImage: { type: String, required: true }, // Uploaded jewellery design
    type: { type: String, enum: ["copyright", "patent"], required: true }, // Application type
    title: { type: String, required: true }, // Name of the design/invention
    description: { type: String, required: true }, // Detailed description
    inventorName: { type: String, required: true }, // Inventor's full name
    country: { type: String, required: true }, // Country of application
    filingDate: { type: Date, default: Date.now }, // When the application was submitted
    priorityClaim: { type: Boolean, default: false }, // If claiming priority from another application
    priorityDetails: {
        previousApplicationNumber: { type: String },
        previousFilingDate: { type: Date },
        previousCountry: { type: String }
    }, // Only required if priorityClaim is true
    supportingDocuments: [{ type: String }], // URLs of PDFs, sketches, or legal docs
}, { timestamps: true });


 const ProtectionApplication = mongoose.model('ProtectionApplication', ProtectionApplicationSchema);
 export default ProtectionApplication;