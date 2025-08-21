const express4 = require('express');
const router4 = express4.Router();
const AIController2 = require('../controllers/aiController');
const authMw4 = require('../middleware/auth');


router4.post('/run', authMw4, AIController2.runModel);



