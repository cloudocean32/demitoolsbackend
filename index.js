require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Tambahkan ini jika belum ada
const app = express();

// Middleware
app.use(cors()); // Tambahkan ini jika belum ada
app.use(express.json());

// Import Routes
const seoRouter = require('./api/routes/seo-routes');
const whoisRouter = require('./api/routes/whois-routes');
const whoisHistoryRouter = require('./api/routes/whoxy-routes'); // MODIFIED: Import router baru

app.get('/', (req, res) => {
    res.send("Demitools Api Started!");
})

// Use Routes
app.use('/api', seoRouter);
app.use('/api', whoisRouter);
app.use('/api', whoisHistoryRouter); // MODIFIED: Daftarkan router baru

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('🚨 Server Error:', err);
});
