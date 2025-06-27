const { getSeoData } = require('../services/seo-service');

const seoCheck = async (req, res) => {
  try {
    if (!req.body.domains || !Array.isArray(req.body.domains)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of domains'
      });
    }

    const domains = req.body.domains.map(d => d.trim()).filter(d => d.length > 0);
    if (domains.length < 1 || domains.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'You must provide between 1 and 100 domains'
      });
    }

    const results = await getSeoData(domains);
    res.json({ success: true, data: results });

  } catch (error) {
    console.error('SEO Error:', error);
    
    const status = error.response?.status || 500;
    res.status(status).json({
      success: false,
      error: 'SEO check failed',
      details: error.response?.data || error.message
    });
  }
};

module.exports = { seoCheck };
