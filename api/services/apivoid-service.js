const axiosInstance = require('../utils/axios-instance');

const checkDomainReputation = async (domainName) => {
    const apiKey = process.env.APIVOID_API_KEY;
    if (!apiKey || apiKey.startsWith('GANTI_DENGAN')) {
        throw new Error('APIVOID API Key belum diatur di file .env');
    }

    const url = 'https://api.apivoid.com/v2/domain-reputation';

    const data = {
        host: domainName,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
        }
    };

    try {
        const response = await axiosInstance.post(url, data, config);

        console.log('RESPONSE >>>>', response);
        if (response.status === 200 && response.data && response.data.blacklists) {
            return response.data; 
        } else {
            throw new Error(response.data.error || 'Respons tidak valid dari APIVOID');
        }
    } catch (error) {
        let errorMessage = 'Gagal menghubungi service APIVOID.';
        if (error.response) {
            errorMessage = error.response.data.error || `Error ${error.response.status}`;
        } else if (error.request) {
            errorMessage = 'Tidak ada respons dari server APIVOID.';
        } else {
            errorMessage = error.message;
        }
        console.error(`Error saat memanggil APIVOID untuk domain ${domainName}:`, errorMessage);
        throw new Error(errorMessage);
    }
};

module.exports = {
    checkDomainReputation,
};
