import Address from "../../models/address.model.js";


export const UserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const addAddress = async (req, res) => {
  try {
    const {
      fullName, phone, houseNo, landmark,
      street, area, state, city, country, zipCode
    } = req.body;

    const newAddress = await Address.create({
      userId: req.user._id,
      fullName, phone, houseNo, landmark,
      street, area, state, city, country, zipCode
    });

    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
