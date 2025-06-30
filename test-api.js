const http = require('http');

// Test spots endpoint
const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/spots',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testing API at http://localhost:4000/api/spots');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:');
    console.log(data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();