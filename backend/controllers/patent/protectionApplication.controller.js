import ProtectionApplication from "../../models/protectionApplication.model.js";

export const applyForPatent = async (req, res) => {
  try {
    const newApplication = new ProtectionApplication({ ...req.body, userId: req.user.id });
    await newApplication.save();
    res.json(newApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
