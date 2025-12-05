const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const adminCtrl = require('../controllers/adminController');

// multer setup -> save to backend/data/uploads/files
const uploadsDir = path.join(__dirname, '..', 'data', 'uploads', 'files');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // keep timestamp prefix
    const safe = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

router.post('/uploads', requireAuth, requireAdmin, upload.array('files', 10), adminCtrl.postUpload);
router.put('/uploads/:id', requireAuth, requireAdmin, upload.array('files', 10), adminCtrl.putUpload);
router.delete('/uploads/:id', requireAuth, requireAdmin, adminCtrl.deleteUpload);
router.get('/uploads/:id/status', requireAuth, requireAdmin, adminCtrl.getUploadStatus);

module.exports = router;
