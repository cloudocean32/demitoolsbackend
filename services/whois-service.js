const net = require('net');

const WHOIS_SERVER = 'whois.verisign-grs.com';
const WHOIS_PORT = 43;

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
    socket.setTimeout(10000);

    socket.on('data', (data) => response += data);
    socket.on('end', () => resolve(parseWhoisResponse(response, domain)));
    socket.on('error', (err) => reject({
      status: 'ERROR',
      message: 'WHOIS lookup failed',
      error: err.message
    }));
    socket.on('timeout', () => {
      socket.destroy();
      reject({ status: 'ERROR', message: 'WHOIS request timed out' });
    });
  });
};

const parseWhoisResponse = (response, domain) => {
  if (response.includes('No match for')) {
    return {
      status: 'UNREGISTER',
      creation_date: null,
      domain: domain
    };
  }

  const creationMatch = response.match(/Creation Date:\s*(\S+)/);
  const expiryMatch = response.match(/Registry Expiry Date:\s*(\S+)/);
  const updatedMatch = response.match(/Updated Date:\s*(\S+)/);
  
  return {
    status: 'REGISTER',
    creation_date: creationMatch?.[1] || null,
    expiry_date: expiryMatch?.[1] || null,
    updated_date: updatedMatch?.[1] || null,
    domain: domain,
    raw: response
  };
};

module.exports = { checkDomain };
