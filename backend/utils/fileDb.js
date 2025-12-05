const fs = require('fs-extra');
const path = require('path');

async function readJSON(filePath) {
  try {
    if (!await fs.pathExists(filePath)) return null;
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    throw err;
  }
}

async function writeJSON(filePath, obj) {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

async function listJSONFiles(dir) {
  const result = [];
  if (!await fs.pathExists(dir)) return result;
  const files = await fs.readdir(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = await fs.stat(full);
    if (stat.isDirectory()) continue;
    if (f.endsWith('.json')) result.push(full);
  }
  return result;
}

module.exports = { readJSON, writeJSON, listJSONFiles };
