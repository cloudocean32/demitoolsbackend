const express = require('express');
const axios = require('axios');
const net = require('net');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());

// Configuration
const SEO_API_KEY = process.env.SEO_API_KEY;
const BASE_SEO_URL = 'https://websiteseochecker.com/api.php';
const WHOIS_SERVER = 'whois.verisign-grs.com';
const WHOIS_PORT = 43;

// Helper functions
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * WHOIS Service
 */
const checkDomain = (domain) => {
    return new Promise((resolve, reject) => {
        const socket = net.createConnection({ 
            host: WHOIS_SERVER,
            port: WHOIS_PORT
        }, () => {
            socket.write(domain + '\r\n');
        });

        let response = '';
        socket.setEncoding('utf8');
        socket.setTimeout(10000); // 10 seconds timeout

        socket.on('data', (data) => {
            response += data;
        });

        socket.on('end', () => {
            if (response.includes('No match for')) {
                resolve({
                    status: 'UNREGISTER',
                    creation_date: null,
                    domain: domain
                });
            } else {
                const creationMatch = response.match(/Creation Date:\s*(\S+)/);
                const expiryMatch = response.match(/Registry Expiry Date:\s*(\S+)/);
                const updatedMatch = response.match(/Updated Date:\s*(\S+)/);
                
                resolve({
                    status: 'REGISTER',
                    creation_date: creationMatch ? creationMatch[1] : null,
                    expiry_date: expiryMatch ? expiryMatch[1] : null,
                    updated_date: updatedMatch ? updatedMatch[1] : null,
                    domain: domain,
                    raw: response // Include raw whois data for debugging
                });
            }
        });

        socket.on('error', (err) => {
            reject({
                status: 'ERROR',
                message: 'WHOIS lookup failed',
                error: err.message
            });
        });

        socket.on('timeout', () => {
            socket.destroy();
            reject({
                status: 'ERROR',
                message: 'WHOIS request timed out'
            });
        });
    });
};

/**
 * SEO Checker Service
 */
const getSeoData = async (domains) => {
    const params = new URLSearchParams();
    params.append('api_key', SEO_API_KEY);
    params.append('items', domains.length.toString());
    
    domains.forEach((domain, index) => {
        params.append(`item${index}`, domain.trim());
    });

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://websiteseochecker.com',
        'Referer': 'https://websiteseochecker.com/'
    };

    await delay(1000); // Rate limiting protection

    const response = await axios.get(`${BASE_SEO_URL}?${params.toString()}`, {
        headers,
        timeout: 15000
    });

    let apiData = typeof response.data === 'string' ? 
                 JSON.parse(response.data) : response.data;

    const formattedResults = {};
    if (Array.isArray(apiData)) {
        apiData.forEach(item => {
            if (item && item.URL) {
                formattedResults[item.URL] = formatSeoItem(item);
            }
        });
    } else if (typeof apiData === 'object') {
        for (const [url, data] of Object.entries(apiData)) {
            formattedResults[url] = formatSeoItem(data);
        }
    }

    return formattedResults;
};

const formatSeoItem = (item) => ({
    URL: item.URL,
    Title: item.Title || 'n/a',
    Categories: item.Categories || null,
    'Domain Authority': item['Domain Authority'] || 0,
    'Page Authority': item['Page Authority'] || 0,
    'Total backlinks': item['Total backlinks'] || 0,
    'Quality backlinks': item['Quality backlinks'] || 0,
    'quality backlinks percentage': item['quality backlinks percentage'] || '0%',
    'MozTrust': item['MozTrust'] || 0,
    'Spam Score': item['Spam Score'] || 0
});

/**
 * Routes
 */

// SEO Check Endpoint
app.post('/api/seo-check', async (req, res) => {
    try {
        if (!req.body.domains || !Array.isArray(req.body.domains)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an array of domains in the "domains" field'
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
        return res.json({ success: true, data: results });

    } catch (error) {
        console.error('SEO API Error:', error);
        
        if (error.response && error.response.data && 
            typeof error.response.data === 'string' && 
            error.response.data.includes('Cloudflare')) {
            return res.status(503).json({
                success: false,
                error: 'API is currently protected by Cloudflare',
                solution: 'Please try again later'
            });
        }

        const status = error.response?.status || 500;
        return res.status(status).json({
            success: false,
            error: 'SEO check failed',
            details: error.response?.data || error.message
        });
    }
});

// WHOIS Endpoint
app.post('/api/whois', async (req, res) => {
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

        // Validate domain format (simple validation)
        if (!/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(domain)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid domain format'
            });
        }

        const result = await checkDomain(domain);
        return res.json({ success: true, data: result });

    } catch (error) {
        console.error('WHOIS Error:', error);
        return res.status(500).json({
            success: false,
            error: 'WHOIS lookup failed',
            details: error.message || error
        });
    }
});

// Combined Endpoint (SEO + WHOIS)
app.post('/api/full-check', async (req, res) => {
    try {
        if (!req.body.domains || !Array.isArray(req.body.domains)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an array of domains in the "domains" field'
            });
        }

        const domains = req.body.domains.map(d => d.trim()).filter(d => d.length > 0);
        if (domains.length < 1 || domains.length > 50) { // Lower limit for combined check
            return res.status(400).json({
                success: false,
                error: 'You must provide between 1 and 50 domains for full check'
            });
        }

        // Run SEO and WHOIS checks in parallel
        const [seoResults, whoisResults] = await Promise.all([
            getSeoData(domains),
            Promise.all(domains.map(domain => checkDomain(domain)))
        ]);

        // Combine results
        const combinedResults = {};
        domains.forEach(domain => {
            combinedResults[domain] = {
                seo: seoResults[domain] || null,
                whois: whoisResults.find(r => r.domain === domain) || null
            };
        });

        return res.json({ success: true, data: combinedResults });

    } catch (error) {
        console.error('Full Check Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Full check failed',
            details: error.message || error
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Domain Services API running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`- POST /api/seo-check`);
    console.log(`- POST /api/whois`);
    console.log(`- POST /api/full-check`);
});
