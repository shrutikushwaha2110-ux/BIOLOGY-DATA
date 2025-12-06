const path = require('path');
const fs = require('fs-extra');

// Get raw data file by name
async function getRawData(req, res) {
    try {
        const { filename } = req.params;
        const rawDir = path.join(__dirname, '..', 'data', 'raw');

        // Sanitize filename to prevent directory traversal
        const sanitizedFilename = path.basename(filename);
        const filePath = path.join(rawDir, sanitizedFilename);

        // Check if file exists
        if (!await fs.pathExists(filePath)) {
            return res.status(404).json({ message: 'Data file not found' });
        }

        // Read and return the JSON data
        const data = await fs.readJSON(filePath);
        res.json(data);
    } catch (err) {
        console.error('getRawData error:', err);
        res.status(500).json({ message: err.message });
    }
}

// List all available raw data files
async function listRawData(req, res) {
    try {
        const rawDir = path.join(__dirname, '..', 'data', 'raw');

        if (!await fs.pathExists(rawDir)) {
            return res.json([]);
        }

        const files = await fs.readdir(rawDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        const result = jsonFiles.map(f => ({
            filename: f,
            name: f.replace('.json', '').replace(/_/g, ' ')
        }));

        res.json(result);
    } catch (err) {
        console.error('listRawData error:', err);
        res.status(500).json({ message: err.message });
    }
}

module.exports = { getRawData, listRawData };
