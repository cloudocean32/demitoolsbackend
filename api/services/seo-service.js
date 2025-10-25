const axiosInstance = require('../utils/axios-instance');

const SEO_API_KEY = process.env.SEO_API_KEY;
const BASE_SEO_URL = 'https://websiteseochecker.com/api.php';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getSeoData = async (domains) => {
  const params = new URLSearchParams();
  params.append('api_key', SEO_API_KEY);
  params.append('items', domains.length.toString());
  
  domains.forEach((domain, index) => {
    params.append(`item${index}`, domain.trim());
  });

  await delay(1000);

  const response = await axiosInstance.get(`${BASE_SEO_URL}?${params.toString()}`, {
    timeout: 15000 
  });

  return formatSeoResponse(response.data);
};

const formatSeoResponse = (apiData) => {
  const formattedResults = {};
  const data = typeof apiData === 'string' ? JSON.parse(apiData) : apiData;

  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item?.URL) {
        formattedResults[item.URL] = formatSeoItem(item);
      }
    });
  } else if (typeof data === 'object' && data !== null) {
    for (const [url, item] of Object.entries(data)) {
      formattedResults[url] = formatSeoItem(item);
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

module.exports = { getSeoData };
