require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Import Routes
const seoRouter = require('./api/routes/seo-routes');
const whoisRouter = require('./api/routes/whois-routes');

app.get('/', (req, res) => {
    res.send("Demitools Api Started!");
})

// Use Routes
app.use('/api', seoRouter);
app.use('/api', whoisRouter);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('🚨 Server Error:', err);
});
