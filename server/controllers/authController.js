const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔐 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Registered successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SUBMIT VERIFICATION =================
exports.submitVerification = async (req, res) => {
  try {
    const { documentUrl } = req.body;

    const user = await User.findById(req.user._id);

    user.verification = {
      status: "pending",
      documentUrl,
    };

    await user.save();

    res.json({ message: "Verification submitted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN VERIFY USER =================
exports.verifyUser = async (req, res) => {
  try {
    const { userId, status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verification.status = status;

    // 🔥 IMPORTANT LOGIC
    if (status === "verified") {
      user.isVerified = true;
    } else {
      user.isVerified = false;
    }

    await user.save();

    res.json({ message: `User ${status} ✅` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// 👨‍💼 ADMIN - Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};