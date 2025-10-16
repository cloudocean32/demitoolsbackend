const axios = require('axios');

const checkDomainReputation = async (domainName) => {
    const apiKey = process.env.APIVOID_API_KEY;
    if (!apiKey || apiKey.startsWith('GANTI_DENGAN')) {
        throw new Error('APIVOID API Key belum diatur di file .env');
    }

    // URL Endpoint yang benar dari dokumentasi
    const url = 'https://api.apivoid.com/v2/domain-reputation';

    // Data yang dikirim dalam body request
    const data = {
        host: domainName,
    };

    // Konfigurasi request, termasuk headers untuk API Key
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
        }
    };

    try {
        // Menggunakan axios.post sesuai dokumentasi
        const response = await axios.post(url, data, config);

        if (response.status === 200 && response.data && response.data.data) {
            // Kita kembalikan hanya bagian report yang penting
            return response.data.data.report;
        } else {
            // Jika API mengembalikan error yang terstruktur
            throw new Error(response.data.error || 'Respons tidak valid dari APIVOID');
        }
    } catch (error) {
        // Menangani error dari Axios (misal: 4xx, 5xx)
        let errorMessage = 'Gagal menghubungi service APIVOID.';
        if (error.response) {
            // Jika APIVOID memberikan pesan error spesifik
            errorMessage = error.response.data.error || `Error ${error.response.status}`;
        } else if (error.request) {
            // Jika request dibuat tapi tidak ada respons
            errorMessage = 'Tidak ada respons dari server APIVOID.';
        } else {
            // Error lainnya
            errorMessage = error.message;
        }
        console.error(`Error saat memanggil APIVOID untuk domain ${domainName}:`, errorMessage);
        throw new Error(errorMessage);
    }
};

module.exports = {
    checkDomainReputation,
};
