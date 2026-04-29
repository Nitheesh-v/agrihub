const User = require("../models/User");

exports.uploadVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.verification = {
      status: "pending",
      documentUrl: req.file.path,
    };

    await user.save();

    res.json({ message: "Verification submitted ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


exports.verifyUser = async (req, res) => {
  try {
    const { userId, status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verification.status = status; // "verified" or "rejected"

    await user.save();

    res.json({ message: "User verification updated ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};