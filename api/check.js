const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint backend untuk cek rekening
app.post('/api/check-account', async (req, res) => {
    const { bankCode, accountNumber } = req.body;

    try {
        // Ganti URL endpoint dan header sesuai dokumentasi resmi QRIS MVP kamu
        const response = await axios.post('https://api.qris-mvp.com/v1/inquiry', {
            bank_code: bankCode,
            account_number: accountNumber
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.QRIS_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || 'Gagal mengecek rekening'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
