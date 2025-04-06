import Address from "../../models/address.model.js";

export const UserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const newAddress = new Address({ ...req.body, userId: req.user.id });
    await newAddress.save();
    res.json(newAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
