const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Spotify API credentials
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_API_TOKEN_URL = 'https://accounts.spotify.com/api/token';

// Store the current access token
let accessToken = null;
let tokenExpirationTime = 0;

// Check if the token is expired, or will expire in the next few seconds.
// Refresh the token if it has or soon will expire.
const checkTokenExpiration = async (req, res, next) => {
  if (!accessToken || Date.now() >= tokenExpirationTime - 5000) {
    await refreshAccessToken();
  }
  next();
};

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      SPOTIFY_API_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Update the access token and expiration time
    accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in * 1000; // Convert to milliseconds
    tokenExpirationTime = Date.now() + expiresIn;

    console.log('Access token refreshed');
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
  }
};

// Endpoint to get a Spotify API access token
app.get('/api/token', checkTokenExpiration, (req, res) => {
  res.json({ access_token: accessToken });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
