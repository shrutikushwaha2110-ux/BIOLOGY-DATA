const fs = require("fs");
const path = require("path");

const metadataDir = path.join(__dirname, "../data/metadata");
const rawDir = path.join(__dirname, "../data/raw");
const refDir = path.join(__dirname, "../data/references");

function walk(folder, callback) {
  fs.readdirSync(folder).forEach((file) => {
    const full = path.join(folder, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full, callback);
    } else {
      callback(full);
    }
  });
}

// extract id (filename without extension)
function getId(filePath) {
  const base = path.basename(filePath);
  return base.replace(path.extname(base), "");
}


// ⭐ API: GET /research
exports.getAllResearch = (req, res) => {
  const results = [];

  walk(metadataDir, (filePath) => {
    if (!filePath.endsWith(".json")) return;

    const data = JSON.parse(fs.readFileSync(filePath));
    const id = getId(filePath);

    results.push({
      id,
      title: data.title || "Untitled",
      category: data.category || "Unknown",
      year: data.year || "Unknown",
      abstract: data.abstract ? data.abstract.slice(0, 150) + "..." : "",
    });
  });

  res.json(results);
};


// ⭐ API: GET /research/:id
exports.getResearchById = (req, res) => {
  const id = req.params.id;

  let metaFile = null;
  let rawFile = null;
  let references = [];

  // find metadata file
  walk(metadataDir, (filePath) => {
    if (filePath.includes(id) && filePath.endsWith(".json")) {
      metaFile = filePath;
    }
  });

  // find raw file
  walk(rawDir, (filePath) => {
    if (filePath.includes(id)) rawFile = filePath;
  });

  // find reference folder
  walk(refDir, (filePath) => {
    if (filePath.includes(id)) {
      references.push(filePath);
    }
  });

  res.json({
    metadata: metaFile ? JSON.parse(fs.readFileSync(metaFile)) : null,
    raw: rawFile ? fs.readFileSync(rawFile, "utf8") : null,
    references,
  });
};
