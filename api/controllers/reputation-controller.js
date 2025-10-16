const apivoidService = require('../services/apivoid-service');

const getReputation = async (req, res, next) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({ success: false, error: 'Domain wajib diisi di dalam body request.' });
    }

    try {
        const reputationData = await apivoidService.checkDomainReputation(domain);
        res.json({ success: true, data: reputationData });
    } catch (error) {
        // Teruskan error ke middleware error handling di index.js
        next(error);
    }
};

module.exports = {
    getReputation,
};
