const Order = require("../models/Order");
const Crop = require("../models/Crop");
// ✅ Create Order


exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const validatedItems = [];

    for (let item of items) {
      const crop = await Crop.findById(item.crop);

      if (!crop) {
        return res.status(400).json({
          message: "Invalid crop selected",
        });
      }

      validatedItems.push({
        crop: crop._id,
        quantity: item.quantity,
        price: crop.price, // ✅ always take from DB
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get My Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
     .populate("items.crop", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};