const express = require('express');
const router = express.Router();
const f = require('../controllers/filtersController');

router.get('/years', f.years);
router.get('/authors', f.authors);
router.get('/keywords', f.keywords);
router.get('/domains', f.domains);

module.exports = router;
