const axios = require('axios');

// 1. Baca konfigurasi proxy dari .env
const proxyHost = process.env.PROXY_HOST;
const proxyPort = process.env.PROXY_PORT;
const proxyUsername = process.env.PROXY_USERNAME;
const proxyPassword = process.env.PROXY_PASSWORD;

// 2. Cek apakah semua variabel proxy ada
const useProxy = proxyHost && proxyPort && proxyUsername && proxyPassword;

let proxyConfig = null;
if (useProxy) {
    proxyConfig = {
        // Sesuaikan 'http' jika provider proxy kamu pakai https
        protocol: 'http', 
        host: proxyHost,
        port: parseInt(proxyPort, 10),
        auth: {
            username: proxyUsername,
            password: proxyPassword,
        },
    };
    console.log('AXIOS: Konfigurasi proxy ditemukan dan akan digunakan.');
} else {
    console.log('AXIOS: Variabel proxy tidak lengkap. Berjalan tanpa proxy.');
}

// 3. Buat dan ekspor instance Axios
// Instance ini akan otomatis pakai proxy JIKA variabel .env diatur
const axiosInstance = axios.create({
    // Tambahkan config proxy HANYA jika ada
    ...(proxyConfig && { proxy: proxyConfig }),

    // Kita set User-Agent & Accept default di sini
    // untuk semua request, biar nggak perlu set di tiap service
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
    }
});

module.exports = axiosInstance;
