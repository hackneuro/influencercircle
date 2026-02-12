const https = require('https');

const data = JSON.stringify({
  email: 'test@example.com',
  name: 'Test User',
  phone: '+1',
  channel: 'linkedin'
});

const options = {
  hostname: 'remote.hackneuro.com',
  port: 443,
  path: '/api/public/link/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': '019bfb84-c738-7064-bba6-a9082e8e6140',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();