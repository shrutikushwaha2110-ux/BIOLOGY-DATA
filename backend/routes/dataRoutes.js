const express = require('express');
const router = express.Router();
const { getRawData, listRawData } = require('../controllers/dataController');

// List all available raw data files
router.get('/', listRawData);

// Get a specific raw data file by filename
router.get('/:filename', getRawData);

module.exports = router;
