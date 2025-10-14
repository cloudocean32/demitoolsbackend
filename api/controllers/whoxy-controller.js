const whoxyService = require('../services/whoxy-service');

const fetchWhoisHistory = async (req, res, next) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({ success: false, error: 'Domain name is required' });
    }

    try {
        const historyData = await whoxyService.getWhoisHistory(domain);
        res.status(200).json({ success: true, data: historyData });
    } catch (error) {
        // Pass the error to the global error handler
        next(error);
    }
};

module.exports = {
    fetchWhoisHistory
};
