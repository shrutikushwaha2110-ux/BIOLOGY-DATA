const Research = require('../models/Research');

async function search(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ q: '', results: [] });

    // Case-insensitive regex for search
    const regex = new RegExp(q, 'i');

    const researchDocs = await Research.find({
      $or: [
        { title: regex },
        { abstract: regex },
        { tags: regex },
        { authors: regex }
      ]
    }).limit(50); // Limit results to avoid overload

    const results = researchDocs.map(doc => ({
      id: doc.slug,
      title: doc.title,
      abstract: doc.abstract,
      category: doc.category_name || 'Biology', // fallbacks
      year: doc.year ? String(doc.year) : '',
      tags: doc.tags || []
    }));

    res.json({ q, count: results.length, results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { search };
