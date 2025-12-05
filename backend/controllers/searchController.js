const path = require('path');
const { listJSONFiles, readJSON } = require('../utils/fileDb');

async function search(req, res) {
  try {
    const q = (req.query.q || '').toLowerCase().trim();
    if (!q) return res.json({ q: '', results: [] });

    const metaDir = path.join(__dirname, '..', 'data', 'metadata');
    const files = await listJSONFiles(metaDir);

    const results = [];
    for (const f of files) {
      const meta = await readJSON(f);
      const title = (meta.title || '').toLowerCase();
      const abstract = (meta.abstract || '').toLowerCase();
      const tags = (meta.tags || []).map(t => (''+t).toLowerCase()).join(' ');
      const authors = (meta.authors || []).join(' ').toLowerCase();

      if (title.includes(q) || abstract.includes(q) || tags.includes(q) || authors.includes(q)) {
        results.push({
          id: path.basename(f, '.json'),
          title: meta.title || '',
          abstract: meta.abstract || '',
          category: meta.category || meta.category_name || '',
          year: meta.year || '',
          tags: meta.tags || []
        });
      }
    }

    res.json({ q, count: results.length, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { search };
