const path = require('path');
const { listJSONFiles, readJSON } = require('../utils/fileDb');

async function years(req, res) {
  try {
    const metaDir = path.join(__dirname, '..', 'data', 'metadata');
    const files = await listJSONFiles(metaDir);
    const set = new Set();
    for (const f of files) {
      const m = await readJSON(f);
      if (m.year) set.add(String(m.year));
    }
    res.json(Array.from(set).sort((a,b)=>b-a));
  } catch (err) { res.status(500).json({ message: err.message }); }
}

async function authors(req, res) {
  try {
    const metaDir = path.join(__dirname, '..', 'data', 'metadata');
    const files = await listJSONFiles(metaDir);
    const set = new Set();
    for (const f of files) {
      const m = await readJSON(f);
      const authors = m.authors || [];
      authors.forEach(a => { if(a) set.add(a); });
    }
    res.json(Array.from(set).sort());
  } catch (err) { res.status(500).json({ message: err.message }); }
}

async function keywords(req, res) {
  try {
    const metaDir = path.join(__dirname, '..', 'data', 'metadata');
    const files = await listJSONFiles(metaDir);
    const set = new Set();
    for (const f of files) {
      const m = await readJSON(f);
      const tags = m.tags || [];
      tags.forEach(t => { if(t) set.add(t); });
    }
    res.json(Array.from(set).sort());
  } catch (err) { res.status(500).json({ message: err.message }); }
}

async function domains(req, res) {
  try {
    // treat category as domain
    const metaDir = path.join(__dirname, '..', 'data', 'metadata');
    const files = await listJSONFiles(metaDir);
    const set = new Set();
    for (const f of files) {
      const m = await readJSON(f);
      const cat = m.category || m.domain || m.category_name;
      if (cat) set.add(cat);
    }
    res.json(Array.from(set).sort());
  } catch (err) { res.status(500).json({ message: err.message }); }
}

module.exports = { years, authors, keywords, domains };
