const express = require("express");
require("dotenv").config();
const paymentRoutes = require("./routes/paymentRoutes");
const testRoutes = require("./routes/testRoutes");
const contractRoutes = require("./routes/contractRoutes");
const cropRoutes = require("./routes/cropRoutes");
const orderRoutes = require("./routes/orderRoutes");



const cors = require("cors");


const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);


app.use("/api/contracts", contractRoutes);
app.use("/api/crops", cropRoutes);


app.use("/api/orders", orderRoutes);



app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});