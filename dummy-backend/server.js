const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Define the base API URL
const BASE_API_URL = 'https://api.ecommerce-demo.lullabydevhub.com/products';
const DB_PATH = path.join(__dirname, 'data', 'products.json');

// Helper function to read DB
const readDB = () => {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
};

// Helper function to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Route to fetch products with offset and content
app.get('/api/v1/product/list', async (req, res) => {
    const { page = 0, size = 8 } = req.query; // Default values: page=0, size=8

    try {
        // Fetch data from the external API
        const response = await axios.get(`${BASE_API_URL}?page=${page}&size=${size}`);

        // Send the fetched data as the response
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching data from the API:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get cart
app.get('/api/v1/cart', (req, res) => {
    const db = readDB();
    const cart = db.cart;
    const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalLength = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
        cart,
        totalPrice,
        totalLength
    });
});

// Add to cart
app.post('/api/v1/cart', (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const db = readDB();
    
    // Find product
    const product = db.products.find(p => p.productId === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product already in cart
    const cartItemIndex = db.cart.findIndex(item => item.product.productId === productId);
    
    if (cartItemIndex >= 0) {
        // Update quantity
        db.cart[cartItemIndex].quantity += quantity;
        db.cart[cartItemIndex].totalPrice = Number((db.cart[cartItemIndex].quantity * product.price).toFixed(1));
    } else {
        // Add new item
        db.cart.push({
            product,
            quantity,
            totalPrice: Number((quantity * product.price).toFixed(1))
        });
    }

    writeDB(db);

    // Calculate cart totals
    const totalPrice = db.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalLength = db.cart.reduce((sum, item) => sum + item.quantity, 0);

    // Return the full cart response
    res.json({
        cart: db.cart,
        totalPrice,
        totalLength
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
