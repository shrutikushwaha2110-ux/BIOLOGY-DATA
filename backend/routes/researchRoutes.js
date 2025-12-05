const express = require('express');
const router = express.Router();
const r = require('../controllers/researchController');

router.get('/:id', r.getResearch);
router.get('/:id/abstract', r.getAbstract);
router.get('/:id/content', r.getContent);
router.get('/:id/figures', r.getFigures);
router.get('/:id/datasets', r.getDatasets);

module.exports = router;
