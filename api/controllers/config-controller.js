const configService = require('../services/config-service');

const handleGetSeoKey = (req, res) => {
  try {
    const apiKey = configService.getDynamicSeoKey();
    res.status(200).json({ apiKey: apiKey });
  } catch (error) {
    console.error('Error in handleGetSeoKey:', error.message);
    res.status(500).json({ error: 'Could not retrieve SEO API Key from server' });
  }
};

module.exports = {
  handleGetSeoKey
};
