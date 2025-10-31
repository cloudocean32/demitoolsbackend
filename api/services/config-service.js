const getDynamicSeoKey = () => {
  const dynamicKey = process.env.SEO_API_KEY;
  if (!dynamicKey) {
    throw new Error('SEO_API_KEY is not set on server environment');
  }
  return dynamicKey;
};

module.exports = { 
  getDynamicSeoKey 
};
