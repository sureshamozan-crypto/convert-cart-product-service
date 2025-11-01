import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import productRoutes from "./src/routes/productRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// connect to MongoDB
connectDB();

// routes
app.use("/products", productRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`🚀 Product Service running on port ${PORT}`));
