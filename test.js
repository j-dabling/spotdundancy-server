const assert = require('assert');
const http = require('http');

// Replace 'your-app-name' and 'your-fly-domain' with your actual app name and Fly domain
const appUrl = 'http://localhost:3000';

// Function to perform the HTTP request
const performRequest = (path, callback) => {
  http.get(`${appUrl}${path}`, (res) => {
    let data = '';

    // A chunk of data has been received.
    res.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received.
    res.on('end', () => {
      callback(null, res, data);
    });
  }).on('error', (err) => {
    callback(err);
  });
};

// Test: Ensure the /api/token endpoint returns a valid access token
performRequest('/api/token', (err, res, data) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1); // Indicate a test failure
  }

  assert.strictEqual(res.statusCode, 200, 'Expected status code 200');
  
  try {
    const { access_token } = JSON.parse(data);
    assert.ok(access_token, 'Access token not received');
    console.log('Test passed successfully');
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError.message);
    process.exit(1); // Indicate a test failure
  }
});
