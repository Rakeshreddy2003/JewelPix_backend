import User from "../../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = req.user; // comes from `protect` middleware
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
