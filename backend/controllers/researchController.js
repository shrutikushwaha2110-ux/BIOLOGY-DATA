const path = require('path');
const fs = require('fs-extra');
const { listJSONFiles, readJSON } = require('../utils/fileDb');

// helper: read metadata file by id (file base name)
async function getMetadataById(id) {
  const metaDir = path.join(__dirname, '..', 'data', 'metadata');
  const files = await listJSONFiles(metaDir);
  for (const f of files) {
    const base = path.basename(f, '.json');
    if (base.toLowerCase() === id.toLowerCase()) {
      return await readJSON(f);
    }
  }
  return null;
}

async function getResearch(req, res) {
  const { id } = req.params;
  try {
    const meta = await getMetadataById(id);
    if (!meta) return res.status(404).json({ message: 'Not found' });
    res.json(meta);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAbstract(req, res) {
  const { id } = req.params;
  try {
    const meta = await getMetadataById(id);
    if (!meta) return res.status(404).json({ message: 'Not found' });
    const abstract = meta.abstract || '';
    res.json({ id, abstract });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getContent(req, res) {
  // here we expect metadata.containers or content sections
  const { id } = req.params;
  try {
    const meta = await getMetadataById(id);
    if (!meta) return res.status(404).json({ message: 'Not found' });
    const content = meta.content || meta.sections || [];
    res.json({ id, content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getFigures(req, res) {
  const { id } = req.params;
  try {
    const meta = await getMetadataById(id);
    if (!meta) return res.status(404).json({ message: 'Not found' });
    const figures = meta.figures || meta.images || [];
    res.json({ id, figures });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getDatasets(req, res) {
  const { id } = req.params;
  try {
    const meta = await getMetadataById(id);
    if (!meta) return res.status(404).json({ message: 'Not found' });
    // if metadata references raw filenames, transform
    const datasets = meta.datasets || meta.dataset_files || [];
    // return URL endpoints local path
    const baseUrl = `/api/files/raw/`;
    const datasetUrls = datasets.map(d => {
      const name = typeof d === 'string' ? d : (d.filename || d.file);
      return { name, url: baseUrl + encodeURIComponent(name) };
    });
    res.json({ id, datasets: datasetUrls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getResearch, getAbstract, getContent, getFigures, getDatasets };
