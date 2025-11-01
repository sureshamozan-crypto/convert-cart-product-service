import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },                  // Product ID
  title: { type: String, required: true },               // name -> title
  price: { type: String },                               // price (can come as string)
  stock_status: { type: String, enum: ["instock", "outofstock"] },
  stock_quantity: { type: Number, default: null },       // can be null
  category: { type: String },                            // categories[0].name
  tags: { type: [String] },                              // tags[].name
  on_sale: { type: Boolean, default: false },            // Boolean
  created_at: { type: Date },                            // date_created (ISO string)
});

export default mongoose.model("Product", productSchema);
