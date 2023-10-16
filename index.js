const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser())
app.use(cors());
app.use('/api', require('./router/routing')); // Corrected the router path

module.exports = app;