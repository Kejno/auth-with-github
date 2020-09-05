const { Router } = require('express')

const express = require('express');
// const { Router } = require('express');
const bodyParser = require('body-parser');
const FormData = require('form-data');
const fetch = require('node-fetch');
// const shortid = require('shortid');
const User = require('../model/User');
const router = Router();

const app = express();

// MongoDB
/* const connectDB = require('../config/bd');
connectDB(); */

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'text/*' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

router.post('/', async (req, res) => {
  const { client_id, redirect_uri, client_secret, code } = req.body;
  console.log(req.body);

  const data = new FormData();
  data.append('client_id', client_id);
  data.append('client_secret', client_secret);
  data.append('code', code);
  data.append('redirect_uri', redirect_uri);

  // Request to exchange code for an access token
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: data
  })
    .then(response => response.text())
    .then(paramsString => {
      const params = new URLSearchParams(paramsString);
      const access_token = params.get('access_token');
      const scope = params.get('scope');
      const token_type = params.get('token_type');
      console.log(access_token, scope, token_type);

      // Request to return data of a user that has been authenticated
      return fetch(
        `https://api.github.com/user?access_token=${access_token}&scope=${scope}&token_type=${token_type}`
      );
    })
    .then(response => response.json())
    .then(async response => {
      const resp = await response;
      const { id, login } = resp;

      const candidate = await User.findOne({ githubId: id });
      if (!candidate) {
        const user = new User({ githubId: id, login });
        await user.save();
      }

      return res.status(200).json(resp);
    })

    .catch(error => {
      return res.status(400).json(error);
    });
});

module.exports = router;
