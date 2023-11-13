// index.js
// When an authenticated request is made, will access the Spotify API and
// request a new access token, or refresh a current access token if it is 
// too close to expiration.
//
// The Spotify Client ID and Secret are stored in environment variables:
//  - SPOTIFY_CLIENT_ID
//  - SPOTIFY_CLIENT_SECRET
// 
// The authentication token is also stored as an environment variable:
//  - AUTH_TOKEN
//
// Tests can be run in a terminal by using curl (Unix) or Invoke-WebRequest (Windows)
// 'curl -X GET http://localhost:3000/api/token -H "Authorization: Bearer *access token*"'
// 'Invoke-WebRequest -Uri "http://localhost:3000/api/token" -Headers "Authorization: Bearer *access token*" -Method Get'
const express = require('express');
const axios = require('axios');
const app = express();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_API_TOKEN_URL = 'https://accounts.spotify.com/api/token';

// Store the current access token
let accessToken = null;
let tokenExpirationTime = 0;


// Obtains a new Spotify access token.
const getSpotifyToken = async () => {
  // Use the stored access token
  return accessToken;
};


// Refresh a current access token.
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      SPOTIFY_API_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        auth: {
          username: SPOTIFY_CLIENT_ID,
          password: SPOTIFY_CLIENT_SECRET,
        },
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
    throw error; // Rethrow the error to handle it in the calling function
  }
};


// Check if the token is expired, or will expire in the next few seconds.
// Makes sure that old tokens are not sent right before they expire.
const checkTokenExpiration = async (req, res, next) => {
  if (!accessToken || Date.now() >= tokenExpirationTime - 5000) {
    try {
      await refreshAccessToken();
    } catch (error) {
      console.error('Error refreshing access token:', error.message);
    }
  }
  next();
};


// Authenticates with the server using it's own token before giving a Spotify token.
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const flyToken = token.split(' ')[1];
  const expectedToken = process.env.AUTH_TOKEN;

  // Check if the provided token matches the expected Fly.io secret
  if (flyToken === expectedToken) {
    next(); // If it matches, all good. Continue.
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};


// Endpoint authentication that returns the obtained Spotify token.
app.get('/api/token', authenticate, checkTokenExpiration, async (req, res) => {
  try {
    const spotifyToken = await getSpotifyToken();

    if (spotifyToken) {
      // Format the spotify token into the HTTP response.
      res.json({ access_token: spotifyToken });
    } else {
      res.status(500).json({ error: 'Failed to obtain Spotify token' });
    }
  } catch (error) {
    console.error('Error obtaining Spotify token:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
