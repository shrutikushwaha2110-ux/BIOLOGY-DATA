const fs = require("fs");
const path = require("path");

exports.getCategories = (req, res) => {
  const metadataDir = path.join(__dirname, "../data/metadata");
  const categories = new Set();

  function walk(folder) {
    fs.readdirSync(folder).forEach((file) => {
      const full = path.join(folder, file);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) return walk(full);

      if (file.endsWith(".json")) {
        const json = JSON.parse(fs.readFileSync(full));

        if (json.category) categories.add(json.category);
      }
    });
  }

  walk(metadataDir);

  res.json([...categories]);
};
