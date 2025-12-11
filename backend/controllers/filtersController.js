const Research = require('../models/Research');
const Category = require('../models/Category');

async function years(req, res) {
  try {
    const years = await Research.distinct('year');
    // Filter out nulls/undefined and sort descending
    const sorted = years.filter(y => y != null).map(String).sort((a, b) => b.localeCompare(a));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function authors(req, res) {
  try {
    const authors = await Research.distinct('authors');
    const sorted = authors.filter(a => a).sort();
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function keywords(req, res) {
  try {
    const tags = await Research.distinct('tags');
    const sorted = tags.filter(t => t).sort();
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function domains(req, res) {
  try {
    const categories = await Category.find({}, 'name');
    const sorted = categories.map(c => c.name).sort();
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { years, authors, keywords, domains };
