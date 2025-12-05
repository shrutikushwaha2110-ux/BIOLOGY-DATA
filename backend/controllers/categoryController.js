const path = require('path');
const { listJSONFiles, readJSON } = require('../utils/fileDb');

async function getCategories(req, res) {
  try {
    const dir = path.join(__dirname, '..', 'data', 'metadata');
    const files = await listJSONFiles(dir);
    const categories = {};
    for (const f of files) {
      try {
        const meta = await readJSON(f);
        const cat = meta.category || meta.category_name || meta.category_id || 'Uncategorized';
        if (!categories[cat]) categories[cat] = { name: cat, count: 0, example: meta.title || '' };
        categories[cat].count++;
      } catch (e) {
        console.warn(`Error reading file ${f}:`, e.message);
      }
    }
    const arr = Object.values(categories);
    res.json(arr);
  } catch (err) {
    console.error('getCategories error:', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getCategories };
