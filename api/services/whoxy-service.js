const axios = require('axios');

const getWhoisHistory = async (domainName) => {
    const apiKey = process.env.WHOXY_API_KEY;
    if (!apiKey) {
        throw new Error('Whoxy API Key is not configured on the server.');
    }

    const url = `https://api.whoxy.com/?key=${apiKey}&history=${domainName}`;

    try {
        const response = await axios.get(url);

        // Whoxy returns status 0 for errors
        if (response.data.status === 0) {
            throw new Error(response.data.status_reason || 'Unknown error from Whoxy API');
        }

        return response.data;
    } catch (error) {
        console.error(`Error fetching Whois history for ${domainName}:`, error.message);
        // Re-throw the error to be caught by the controller
        throw error;
    }
};

module.exports = {
    getWhoisHistory
};
