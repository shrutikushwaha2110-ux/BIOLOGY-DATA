const express = require('express');
const router = express.Router();
const path = require('path');

// serve raw files by name from data/raw
router.get('/raw/:name', (req, res) => {
  const { name } = req.params;
  const file = path.join(__dirname, '..', 'data', 'raw', name);
  res.sendFile(file, err => {
    if (err) res.status(404).json({ message: 'File not found' });
  });
});

// serve upload files
router.get('/uploads/files/:name', (req, res) => {
  const { name } = req.params;
  const file = path.join(__dirname, '..', 'data', 'uploads', 'files', name);
  res.sendFile(file, err => {
    if (err) res.status(404).json({ message: 'File not found' });
  });
});

module.exports = router;
