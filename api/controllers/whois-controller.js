const { checkDomain } = require('../services/whois-service');

const whoisCheck = async (req, res) => {
  try {
    if (!req.body.domain) {
      return res.status(400).json({
        success: false,
        error: 'Domain parameter is required'
      });
    }

    const domain = req.body.domain.trim();
    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Domain cannot be empty'
      });
    }

    // Enhanced domain validation
    if (!/^(?!:\/\/)([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}$/.test(domain)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid domain format'
      });
    }

    const result = await checkDomain(domain);
    res.json({ 
      success: true, 
      data: result 
    });

  } catch (error) {
    console.error('WHOIS Error:', error);
    res.status(500).json({
      success: false,
      error: 'WHOIS lookup failed',
      details: error.message || error
    });
  }
};

module.exports = { whoisCheck };
