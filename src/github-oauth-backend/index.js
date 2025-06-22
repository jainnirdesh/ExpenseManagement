require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

// Step 1: Redirect user to GitHub for login
app.get('/auth/github', (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}`;
  res.redirect(redirectUrl);
});

// Step 2: GitHub redirects back with code, exchange for token
app.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );
    const accessToken = tokenRes.data.access_token;
    // (Optional) Get user info
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });
    // Send user info to frontend (for demo, show as JSON)
    res.json(userRes.data);
  } catch (err) {
    res.status(500).send('Authentication failed');
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));