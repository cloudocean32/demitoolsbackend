require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Import Routes
const seoRouter = require('./api/routes/seo-routes');
const whoisRouter = require('./api/routes/whois-routes');
const hiRouter = require('./api/routes/hi-routes');

// Use Routes
app.use('/api/', hiRouter);
app.use('/api/', seoRouter);
app.use('/api/', whoisRouter);

app.get('/', (req, res) => {
    res.send("Demitools Api Started!");
})

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  Server running on port ${PORT}
  Available endpoints:
  - POST /api/
  - POST /api/
  `);
});
