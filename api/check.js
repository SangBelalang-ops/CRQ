const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint API untuk cek massal
app.post('/api/check-accounts', async (req, res) => {
    const { accounts } = req.body; // Array list rekening
    const results = [];

    for (let item of accounts) {
        try {
            // Sesuaikan endpoint & payload header dengan target QRIS MVP temanmu
            const response = await fetch('http://qrismvp.s3-website-ap-southeast-1.amazonaws.com/api/inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer TOKEN_KAMU_DISINI' // Tambahkan token jika diperlukan
                },
                body: JSON.stringify({
                    bank_code: item.bankCode,
                    account_number: item.accountNumber
                })
            });

            const data = await response.json();
            results.push({
                bank: item.bankCode,
                account: item.accountNumber,
                status: data.status || 'SUCCESS',
                accountName: data.account_name || 'TIDAK DITEMUKAN'
            });
        } catch (err) {
            results.push({
                bank: item.bankCode,
                account: item.accountNumber,
                status: 'ERROR',
                accountName: 'Rekening Invalid / Gagal'
            });
        }
    }

    res.json({ results });
});

module.exports = app;

// Jalankan local jika tidak di Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.0 || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
