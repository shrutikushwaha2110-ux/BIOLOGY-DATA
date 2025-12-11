const Research = require('../models/Research');

// Helper: Generate slug from title
function generateSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 50);
}

// Get all research datasets
async function getAllResearch(req, res) {
  try {
    const researchDocs = await Research.find({}).sort({ createdAt: -1 });

    const results = researchDocs.map(doc => ({
      id: doc.slug,
      title: doc.title,
      description: doc.description || doc.abstract,
      source_name: doc.source_name || '',
      source_url: doc.source_url || '',
      authors: doc.authors ? doc.authors.join(', ') : '',
      journal: doc.journal || '',
      year: doc.year || '',
      doi: doc.doi || '',
      last_updated: doc.last_updated || doc.updatedAt,
      raw_data_file: doc.dataset_file || '',
      category: 'Biology', // You might want to populate this if using categories
      tags: doc.tags || [],
      // Placeholder or logic for thumbnail if needed
      thumbnail: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
    }));

    res.json(results);
  } catch (err) {
    console.error('getAllResearch error:', err);
    res.status(500).json({ message: err.message });
  }
}

async function getResearch(req, res) {
  const { id } = req.params; // id here is the slug
  try {
    const research = await Research.findOne({ slug: id });
    if (!research) return res.status(404).json({ message: 'Not found' });

    // Transform to match expected format if necessary, or return doc
    // The original fileDb returned a specific structure, assuming frontend handles the doc structure now
    res.json(research);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAbstract(req, res) {
  const { id } = req.params;
  try {
    const research = await Research.findOne({ slug: id });
    if (!research) return res.status(404).json({ message: 'Not found' });
    res.json({ id, abstract: research.abstract });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getContent(req, res) {
  const { id } = req.params;
  try {
    const research = await Research.findOne({ slug: id });
    if (!research) return res.status(404).json({ message: 'Not found' });
    // Assuming content logic needs to be defined or we use a field. 
    // For now returning empty or placeholder as previous code used metadata parts.
    res.json({ id, content: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getFigures(req, res) {
  const { id } = req.params;
  try {
    const research = await Research.findOne({ slug: id });
    if (!research) return res.status(404).json({ message: 'Not found' });
    res.json({ id, figures: research.image_files || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getDatasets(req, res) {
  const { id } = req.params;
  try {
    const research = await Research.findOne({ slug: id });
    if (!research) return res.status(404).json({ message: 'Not found' });

    let datasets = [];
    if (research.dataset_file) {
      datasets.push(research.dataset_file);
    }

    const baseUrl = `/api/files/raw/`;
    const datasetUrls = datasets.map(name => ({
      name,
      url: baseUrl + encodeURIComponent(name)
    }));

    res.json({ id, datasets: datasetUrls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Create new research entry
async function createResearch(req, res) {
  try {
    const { title, authors, abstract, tags, category, year, doi, description, source_name, source_url } = req.body;

    if (!title || !authors || !abstract) {
      return res.status(400).json({ message: 'Title, authors, and abstract are required' });
    }

    const slug = generateSlug(title);

    // Check if exists
    const existing = await Research.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'Research with this title already exists' });
    }

    // Handle authors if string
    const authorsArray = Array.isArray(authors) ? authors : authors.split(',').map(a => a.trim());
    const tagsArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);

    const newResearch = new Research({
      title,
      slug,
      abstract,
      description: description || abstract,
      authors: authorsArray,
      tags: tagsArray,
      year: year || new Date().getFullYear(),
      doi,
      source_name,
      source_url,
      // category_id: category // ignoring for now unless we look up ID
    });

    await newResearch.save();

    res.status(201).json({
      message: 'Research created successfully in MongoDB',
      id: slug,
      research: newResearch
    });
  } catch (err) {
    console.error('Error creating research:', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllResearch, getResearch, getAbstract, getContent, getFigures, getDatasets, createResearch };
