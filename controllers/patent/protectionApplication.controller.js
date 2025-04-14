import ProtectionApplication from "../../models/protectionApplication.model.js";
import ProtectionModel from "../../models/protectionStatus.model.js";

export const applyForPatent = async (req, res) => {
  try {
    const {
      designImage,
      type,
      title,
      description,
      inventorName,
      country,
      priorityClaim,
      priorityDetails,
      supportingDocuments
    } = req.body;

    if (!designImage || !type || !title || !description || !inventorName || !country) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const application = await ProtectionApplication.create({
      userId: req.user._id,
      designImage,
      type,
      title,
      description,
      inventorName,
      country,
      priorityClaim,
      priorityDetails,
      supportingDocuments
    });

    const protection = await ProtectionModel.create({
      applicationId: application._id
    });

    res.status(201).json({ message: "Application submitted successfully", application, protection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// export const approveApplication = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const protection = await ProtectionModel.findById(id);
//     if (!protection) return res.status(404).json({ message: "Application not found" });

//     if (protection.status !== "pending") {
//       return res.status(400).json({ message: "Application is already reviewed" });
//     }

//     protection.status = "approved";
//     protection.approvalDate = new Date();
//     await protection.save();

//     res.status(200).json({ message: "Application approved", protection });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// export const rejectApplication = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const protection = await ProtectionModel.findById(id);
//     if (!protection) return res.status(404).json({ message: "Application not found" });

//     if (protection.status !== "pending") {
//       return res.status(400).json({ message: "Application is already reviewed" });
//     }

//     protection.status = "rejected";
//     await protection.save();

//     res.status(200).json({ message: "Application rejected", protection });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
