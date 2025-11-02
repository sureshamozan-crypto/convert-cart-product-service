# 🛍 WooCommerce Ingest & Product Sync API (Node.js + Express + MongoDB)

This service connects to the **WooCommerce REST API**, fetches product data, and stores it in a **MongoDB Atlas** database.  
It also provides an endpoint to **query products dynamically** for use in your product dashboard, filtering system, or analytics tools.

Built as part of the **Convert Cart Service** microservice ecosystem.

---

## ⚙️ Features

✅ Fetch products from a live WooCommerce store  
✅ Automatically store products into MongoDB Atlas  
✅ Retrieve and filter stored products  
✅ Supports dynamic query parameters (category, price, stock, etc.)  
✅ Secure authentication via environment variables  

---

## 💾 Database Integration

When the `/ingest` route is called:

1. Connects to the WooCommerce REST API  
2. Retrieves product data  
3. Inserts or updates each product in MongoDB (avoiding duplicates)

---

## 🧰 Technologies Used

| Technology | Purpose |
|-------------|----------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **Axios** | HTTP client for WooCommerce |
| **dotenv** | Environment variable management |

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/convert-cart-service.git
cd convert-cart-service
