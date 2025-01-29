const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Define the base API URL
const BASE_API_URL = 'https://api.ecommerce-demo.lullabydevhub.com/products';

// Route to fetch products with offset and content
app.get('/products', async (req, res) => {
    const { offset = 0, content = 8 } = req.query; // Default values: offset=0, content=8

    try {
        // Fetch data from the external API
        const response = await axios.get(`${BASE_API_URL}?offset=${offset}&content=${content}`);

        // Send the fetched data as the response
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching data from the API:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
