require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/api/numinfo', async (req, res) => {
    try {
        const number = req.query.number;

        const response = await axios.get(
            "https://api.apilayer.com/number_verification/validate",
            {
                params: {
                    number: number
                },
                headers: {
                    apikey: process.env.API_KEY
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
