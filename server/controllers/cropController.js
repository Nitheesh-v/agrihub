const Crop = require("../models/Crop");

// 👨‍🌾 Add crop
exports.createCrop = async (req, res) => {
  try {
    const crop = await Crop.create({
      ...req.body,
      farmer: req.user.id,
    });

    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🌍 Public crops (IMPORTANT FILTER)
exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({
      isContractCrop: false, // 🚨 rule
    }).populate("farmer", "name location");

    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👨‍🌾 My crops
exports.getMyCrops = async (req, res) => {
  const crops = await Crop.find({ farmer: req.user.id });
  res.json(crops);
};