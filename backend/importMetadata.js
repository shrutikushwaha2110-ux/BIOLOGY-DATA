const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Flexible metadata schema
const metadataSchema = new mongoose.Schema({}, { strict: false });
const Metadata = mongoose.model("metadata", metadataSchema);

// Recursively walk folder
function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full, callback);
    } else {
      callback(full);
    }
  }
}

function getIdFromFilename(filePath) {
  const base = path.basename(filePath);
  return base.replace(path.extname(base), "");
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Import from ALL 3 folders
    const roots = [
      path.join(__dirname, "data", "metadata"),
      path.join(__dirname, "data", "raw"),
      path.join(__dirname, "data", "references")
    ];

    const promises = [];

    for (const root of roots) {
      walkDir(root, (filePath) => {
        if (!filePath.endsWith(".json")) return;
        if (filePath.endsWith("template.json")) return;

        const rawJson = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const id = getIdFromFilename(filePath);

        const doc = {
          _id: id,
          file_path: path.relative(__dirname, filePath),
          raw_metadata: rawJson,
        };

        promises.push(
          Metadata.updateOne({ _id: id }, doc, { upsert: true }).then(() =>
            console.log("📌 Imported:", id)
          )
        );
      });
    }

    await Promise.all(promises);

    console.log("🎉 ALL metadata imported successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Import error:", err);
    process.exit(1);
  }
}

run();
