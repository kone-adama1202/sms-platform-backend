const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  const data = qs.stringify({ grant_type: 'client_credentials' });
  const auth = Buffer.from(`${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post('https://api.orange.com/oauth/v3/token', data, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    cachedToken = response.data.access_token;
    tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);

    return cachedToken;
  } catch (error) {
    console.error("Erreur OAuth2 Orange:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getAccessToken };
