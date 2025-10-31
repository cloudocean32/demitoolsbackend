require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const seoRouter = require('./api/routes/seo-routes');
const whoisRouter = require('./api/routes/whois-routes');
const whoisHistoryRouter = require('./api/routes/whoxy-routes');
const reputationRouter = require('./api/routes/reputation-routes');
const configRouter = require('./api/routes/config-routes');

app.get('/', (req, res) => {
    res.send("Demitools Api Started!");
})

app.use('/api', seoRouter);
app.use('/api', whoisRouter);
app.use('/api', whoisHistoryRouter);
app.use('/api', reputationRouter);
app.use('/api', configRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('🚨 Server Error:', err);
});
