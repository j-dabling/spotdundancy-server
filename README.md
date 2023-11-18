# spotdundancy-server
Authentication server for Spotdundancy web-plugin.

## Dependencies
- express:

> `npm install express`

- axios:

> `npm install axios`

## index.js
Run this to start the server. It requires three tokens/secrets to run properly, each should be saved as an environment variable with the following names:
- `SPOTIFY_CLIENT_ID`
	The client ID for the spotify API app. An app will need to be set-up on Spotify's developer page to obtain a client ID and Secret. developer.spotify.com/dashboard

- `SPOTIFY_CLIENT_SECRET`
	The client secret for your spotify API app.

- `AUTH_TOKEN`
	A custom token set for authentication before accessing Spotify API tokens. If the client does not include this token in the request, it will return 401.

After configuring the environment and running `node index.js`, the server should be listening on port 3000. 

## TODO
 - Add ability to configure options. (USE_AUTH_TOKEN=true/false, port number, etc.)