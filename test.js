const assert = require('assert');
const http = require('http');

// Replace 'your-app-name' and 'your-fly-domain' with your actual app name and Fly domain
const appUrl = 'http://localhost:3000';
// const appUrl = 'http://verify-spotdundancy.fly.dev/'
// const appUrl = 'http://[2a09:8280:1::24:a49a]'

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



// FlyV1 fm2_lJPECAAAAAAAAbsixBBvhT4zrX96tI0xmpZ3CHbxwrVodHRwczovL2FwaS5mbHkuaW8vdjGWAJLOAAVaYR8Lk7lodHRwczovL2FwaS5mbHkuaW8vYWFhL3YxxDxNlJpl/UGnyVpA10ViorqrXeenYVNlcOU5WTVqMR2SudANBOjYrIuJOrjXDkL61V8c1y65HER2Qwlp3pbER8+ULg5W1wSJfDaZv8t/Gi1QCIVSUnNOUc4MVOsm3V1ohObp8FmAcPPXorKMtApK06zQdZfat+b3Aq3Bg8fMUQXLhG3IdhevDZKUA5GBzgAg2VAfBZGCp2J1aWxkZXIfondnHwHEILxpNa1JhW4td2lyU0IBMaYzvmJBTh1zTUsIP1Q28LsT,fm2_lJPER8+ULg5W1wSJfDaZv8t/Gi1QCIVSUnNOUc4MVOsm3V1ohObp8FmAcPPXorKMtApK06zQdZfat+b3Aq3Bg8fMUQXLhG3IdhevxBC5TtG1xru5pxg70050Lfmzw7lodHRwczovL2FwaS5mbHkuaW8vYWFhL3YxlgSSzmVSmpHPAAAAASFKuK8Kkc4ABPd0DMQQpiov/+eywetB3gAVfkOPgMQgUQTCapxyOzN5aDTZOJaIRw0E3Gyqu5mdk+iFZye6kds=