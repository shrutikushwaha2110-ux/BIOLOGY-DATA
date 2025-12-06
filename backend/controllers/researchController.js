const path = require('path');
const fs = require('fs-extra');
const { listJSONFiles, readJSON } = require('../utils/fileDb');

// Helper: parse metadata array format into a structured object
function parseMetadata(data) {
  if (!Array.isArray(data) || data.length < 3) return null;

  // The third element (index 2) typically contains the main dataset info
  const mainEntry = data[2] || {};

  // Extract fields from the various Column entries
  const result = {
    dataset: mainEntry.dataset || '',
    title: mainEntry.Column2 || mainEntry.Column4 || mainEntry.title || '',
    source_name: mainEntry.Column3 || mainEntry.Column2 || '',
    source_url: mainEntry.Column4 || mainEntry.Column3 || '',
    description: mainEntry.description || mainEntry.Column5 || '',
    last_updated: mainEntry.last_updated || mainEntry.Column6 || '',
    raw_data_file: mainEntry.raw_data_file || mainEntry.Column7 || '',
    processed_data_file: mainEntry.Column8 || '',
    // Citation info
    authors: mainEntry.citation || mainEntry.Column9 || '',
    citation_title: mainEntry.Column10 || '',
    journal: mainEntry.Column11 || mainEntry.Column15 || '',
    year: mainEntry.Column12 || mainEntry.Column16 || '',
    doi: mainEntry.Column13 || mainEntry.Column17 || '',
    url: mainEntry.Column14 || mainEntry.Column18 || '',
  };

  // Collect column definitions from remaining array entries
  const columns = [];
  for (let i = 2; i < data.length; i++) {
    if (data[i].columns) {
      columns.push({
        name: data[i].columns,
        type: data[i].Column16 || data[i].Column20 || '',
        description: data[i].Column17 || data[i].Column21 || '',
        unit: data[i].Column18 || data[i].Column22 || '',
        is_processed: data[i].Column19 || data[i].Column23 || false
      });
    }
  }
  result.columns = columns;

  return result;
}

// Get all research datasets
async function getAllResearch(req, res) {
  try {
    const metaDir = path.join(__dirname, '..', 'data', 'metadata');
    const files = await listJSONFiles(metaDir);

    const results = [];
    for (const f of files) {
      const base = path.basename(f, '.json');
      if (base === 'template') continue; // Skip template file

      try {
        const data = await readJSON(f);
        const parsed = parseMetadata(data);

        if (parsed) {
          results.push({
            id: base,
            title: parsed.title || base.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: parsed.description || '',
            source_name: parsed.source_name || '',
            source_url: parsed.source_url || '',
            authors: parsed.authors || '',
            journal: parsed.journal || '',
            year: parsed.year || '',
            doi: parsed.doi || '',
            last_updated: parsed.last_updated || '',
            raw_data_file: parsed.raw_data_file || '',
            category: getCategory(base),
            tags: getTags(base, parsed),
            thumbnail: getThumbnail(base)
          });
        }
      } catch (err) {
        console.warn(`Error parsing ${f}:`, err.message);
      }
    }

    res.json(results);
  } catch (err) {
    console.error('getAllResearch error:', err);
    res.status(500).json({ message: err.message });
  }
}

// Helper function to determine category based on dataset name
function getCategory(id) {
  const categories = {
    'genome': 'Genomics',
    'gwas': 'Genetics',
    'pbw': 'Agriculture',
    'cotton': 'Agriculture',
  };

  for (const [key, value] of Object.entries(categories)) {
    if (id.toLowerCase().includes(key)) return value;
  }
  return 'Biology';
}

// Helper function to generate tags
function getTags(id, parsed) {
  const tags = [];
  if (id.includes('genome')) tags.push('Genome', 'Sequencing');
  if (id.includes('cost')) tags.push('Cost Analysis', 'Historical Data');
  if (id.includes('projects')) tags.push('Global Projects', 'National Initiatives');
  if (id.includes('gwas')) tags.push('GWAS', 'Population Genetics', 'Ancestry');
  if (id.includes('pbw') || id.includes('cotton')) tags.push('Agriculture', 'Bt Cotton', 'Pest Resistance');
  if (parsed.year) tags.push(parsed.year);
  return tags.slice(0, 5);
}

// Helper function to get thumbnail
function getThumbnail(id) {
  const thumbnails = {
    'genome_cost': 'https://images.unsplash.com/photo-1579154392013-64f6ab5c2aa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    'genome_projects': 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    'gwas_diversity': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    'pbw_damage_cotton_india': 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  };
  return thumbnails[id] || 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
}

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

// Create new research entry
async function createResearch(req, res) {
  try {
    const { title, authors, abstract, tags, category, year, doi } = req.body;

    if (!title || !authors || !abstract) {
      return res.status(400).json({ message: 'Title, authors, and abstract are required' });
    }

    // Generate unique ID from title
    const id = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 50);

    // Create metadata structure matching existing format
    const metadata = [
      { "dataset": id },
      { "Column2": "Name", "Column3": "Source", "Column4": "URL", "Column5": "Description" },
      {
        "dataset": id,
        "Column2": title,
        "Column3": authors,
        "Column4": doi || '',
        "Column5": abstract,
        "Column6": new Date().toISOString().split('T')[0],
        "title": title,
        "description": abstract,
        "citation": authors,
        "Column12": year || new Date().getFullYear().toString(),
        "Column13": doi || '',
        "year": year || new Date().getFullYear().toString()
      }
    ];

    // Add category and tags data
    if (category) {
      metadata[2].category = category;
    }
    if (tags) {
      metadata[2].tags = tags;
    }

    // Save to metadata directory
    const metadataDir = path.join(__dirname, '../data/metadata');
    const filePath = path.join(metadataDir, `${id}.json`);

    // Check if file already exists
    if (await fs.pathExists(filePath)) {
      return res.status(409).json({ message: 'Research with this title already exists' });
    }

    await fs.writeJSON(filePath, metadata, { spaces: 2 });

    res.status(201).json({
      message: 'Research created successfully',
      id,
      filePath: `data/metadata/${id}.json`
    });
  } catch (err) {
    console.error('Error creating research:', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllResearch, getResearch, getAbstract, getContent, getFigures, getDatasets, createResearch };

