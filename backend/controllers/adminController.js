const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const UPLOADS_DIR = path.join(__dirname, '..', 'data', 'uploads');
const UPLOAD_FILES_DIR = path.join(UPLOADS_DIR, 'files');

async function postUpload(req, res) {
  try {
    // metadata comes in body as JSON (fields)
    const metadata = req.body;
    // multer has saved files at req.files (array) or req.file
    const savedFiles = [];
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        // f.path contains save path
        savedFiles.push({
          originalname: f.originalname,
          filename: path.basename(f.path),
          path: path.relative(path.join(__dirname, '..'), f.path)
        });
      }
    }

    const id = `upload_${uuidv4()}`;
    const out = {
      id,
      createdAt: new Date().toISOString(),
      createdBy: req.user.email,
      metadata,
      files: savedFiles
    };

    const outPath = path.join(UPLOADS_DIR, `${id}.json`);
    await fs.ensureDir(UPLOADS_DIR);
    await fs.writeJson(outPath, out, { spaces: 2 });

    res.json({ message: 'Uploaded', id, out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
}

async function putUpload(req, res) {
  try {
    const { id } = req.params;
    const filePath = path.join(UPLOADS_DIR, `${id}.json`);
    if (!await fs.pathExists(filePath)) return res.status(404).json({ message: 'Not found' });

    const cur = await fs.readJson(filePath);
    const updates = req.body;
    // merge
    const updated = { ...cur, metadata: { ...cur.metadata, ...updates } };

    // attach files if any
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        updated.files = updated.files || [];
        updated.files.push({
          originalname: f.originalname,
          filename: path.basename(f.path),
          path: path.relative(path.join(__dirname, '..'), f.path)
        });
      }
    }

    await fs.writeJson(filePath, updated, { spaces: 2 });
    res.json({ message: 'Updated', id, updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteUpload(req, res) {
  try {
    const { id } = req.params;
    const filePath = path.join(UPLOADS_DIR, `${id}.json`);
    if (!await fs.pathExists(filePath)) return res.status(404).json({ message: 'Not found' });
    await fs.remove(filePath);
    res.json({ message: 'Deleted', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getUploadStatus(req, res) {
  try {
    const { id } = req.params;
    const filePath = path.join(UPLOADS_DIR, `${id}.json`);
    if (!await fs.pathExists(filePath)) return res.status(404).json({ message: 'Not found' });
    const j = await fs.readJson(filePath);
    res.json({ id, createdAt: j.createdAt, createdBy: j.createdBy, metadata: j.metadata });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { postUpload, putUpload, deleteUpload, getUploadStatus };
