const http = require('http');

// Helper to get CSRF token
function getCsrfToken(callback) {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/csrf/restore',
    method: 'GET',
  };
  const req = http.request(options, (res) => {
    let data = '';
    let cookies = res.headers['set-cookie'];
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      let token;
      try {
        token = JSON.parse(data).csrfToken;
      } catch (e) {
        console.error('Failed to parse CSRF token:', e);
      }
      callback(token, cookies);
    });
  });
  req.on('error', (e) => {
    console.error(`Problem with CSRF request: ${e.message}`);
    callback(null, null);
  });
  req.end();
}

function getBackendPort() {
  return process.env.BACKEND_PORT || 8000;
}

// Test spots endpoint with CSRF token
getCsrfToken((csrfToken, cookies) => {
  const backendPort = getBackendPort();
  const options = {
    hostname: 'localhost',
    port: backendPort,
    path: '/api/spots',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      'Cookie': cookies ? cookies.join('; ') : ''
    }
  };

  console.log('Testing API at http://localhost:4000/api/spots');

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Response body:');
      console.log(data);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
});