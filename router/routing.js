const express = require("express");
const router = express.Router();
//const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
//app.use(bodyParser())
app.use(cors())
app.use('/registrations',require('../controller/userController'));
app.use('/POC',require('../controller/poc'));
app.use('/User',require('../controller/User'));
module.exports = app;