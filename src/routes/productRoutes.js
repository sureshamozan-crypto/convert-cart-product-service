import express from "express";
import axios from "axios";
import Product from "../models/Product.js";

const router = express.Router();

// 🌐 GET and store products from WooCommerce API
router.get("/ingest", async (req, res) => {
  try {
    // WooCommerce API credentials from .env
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

     const perPage = parseInt(req.query.per_page) || 20;

    if (!consumerKey || !consumerSecret) {
      return res.status(500).json({ message: "Missing WooCommerce credentials" });
    }

    // Fetch data from WooCommerce REST API
    const { data } = await axios.get(
      "https://wp-multisite.convertcart.com/wp-json/wc/v3/products",
      {
        params: {
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
          per_page: perPage,
        },
      }
    );

    // Transform data to match our MongoDB schema
    const products = data.map((item) => ({
      id: item.id,
      title: item.name,
      price: item.price,
      stock_status: item.stock_status,
      stock_quantity: item.stock_quantity || null,
      category: item.categories?.[0]?.name || "Uncategorized",
      tags: item.tags?.map((tag) => tag.name) || [],
      on_sale: item.on_sale,
      created_at: item.date_created,
    }));

    // ✅ Save or update data in MongoDB (no duplicates)
    for (const product of products) {
      await Product.updateOne({ id: product.id }, { $set: product }, { upsert: true });
    }

    res.json({
      message: "✅ Products successfully ingested and stored in MongoDB",
      count: products.length,
    });
  } catch (error) {
    console.error("❌ Error ingesting products:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  console.log("products");
  try {
    // Extract pagination & sorting from query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "created_at";
    const order = req.query.order === "asc" ? 1 : -1;

    // Fetch total count & products
    const total = await Product.countDocuments();
    const products = await Product.find()
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    // If no data
    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found",
        data: [],
      });
    }

    // Return professional API structure
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      pagination: {
        totalRecords: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        perPage: limit,
      },
      sort: { sortBy, order: order === 1 ? "asc" : "desc" },
      data: products,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error while fetching products",
      error: error.message,
    });
  }
});


export default router;
