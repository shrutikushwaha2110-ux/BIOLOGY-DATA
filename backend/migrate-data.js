const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');
const Research = require('./models/Research');
require('dotenv').config();

// --- Parsing Logic (Recovered from old controller) ---
function parseMetadata(data) {
    if (!Array.isArray(data) || data.length < 3) return null;

    const mainEntry = data[2] || {};

    const result = {
        dataset: mainEntry.dataset || '',
        title: mainEntry.Column2 || mainEntry.Column4 || mainEntry.title || '',
        source_name: mainEntry.Column3 || mainEntry.Column2 || '',
        source_url: mainEntry.Column4 || mainEntry.Column3 || '',
        description: mainEntry.description || mainEntry.Column5 || '',
        last_updated: mainEntry.last_updated || mainEntry.Column6 || '',
        raw_data_file: mainEntry.raw_data_file || mainEntry.Column7 || '',
        authors: mainEntry.citation || mainEntry.Column9 || '',
        journal: mainEntry.Column11 || mainEntry.Column15 || '',
        year: mainEntry.Column12 || mainEntry.Column16 || '',
        doi: mainEntry.Column13 || mainEntry.Column17 || '',
        // ... potentially other fields
    };
    return result;
}

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

function getTags(id, parsed) {
    const tags = [];
    if (id.includes('genome')) tags.push('Genome', 'Sequencing');
    if (id.includes('cost')) tags.push('Cost Analysis', 'Historical Data');
    if (id.includes('projects')) tags.push('Global Projects', 'National Initiatives');
    if (id.includes('gwas')) tags.push('GWAS', 'Population Genetics', 'Ancestry');
    if (id.includes('pbw') || id.includes('cotton')) tags.push('Agriculture', 'Bt Cotton', 'Pest Resistance');
    if (parsed.year) tags.push(String(parsed.year));
    return tags.slice(0, 5);
}

function generateSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50);
}

const User = require('./models/User');
const Category = require('./models/Category');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // --- 1. Migrate Research (Existing Logic) ---
        const metaDir = path.join(__dirname, 'data', 'metadata');
        if (await fs.pathExists(metaDir)) {
            console.log('Migrating Research documents...');
            const files = await fs.readdir(metaDir);
            const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'template.json');

            for (const file of jsonFiles) {
                const filePath = path.join(metaDir, file);
                const data = await fs.readJSON(filePath);
                const parsed = parseMetadata(data);
                const id = path.basename(file, '.json');

                if (!parsed) {
                    // console.log(`⚠️ Skipping invalid file: ${file}`);
                    continue;
                }

                const title = parsed.title || id.replace(/_/g, ' ');
                const slug = generateSlug(title);

                // Check if exists
                const exists = await Research.findOne({ slug });
                if (!exists) {
                    // Prepare doc
                    const authorsStr = parsed.authors || '';
                    const authorsArray = typeof authorsStr === 'string' ? authorsStr.split(',').map(a => a.trim()).filter(a => a) : [];

                    const doc = new Research({
                        title: title,
                        slug: slug,
                        abstract: parsed.description || 'No abstract available.', // Mapping description to abstract as per old logic
                        description: parsed.description,
                        authors: authorsArray,
                        source_name: parsed.source_name,
                        source_url: parsed.source_url,
                        journal: parsed.journal,
                        doi: parsed.doi,
                        last_updated: parsed.last_updated,
                        year: parseInt(parsed.year) || null,
                        dataset_file: parsed.raw_data_file,
                        category_name: getCategory(id), // Helper to just store string for now if needed, or rely on tags
                        tags: getTags(id, parsed),
                        // image_files? Not easily parseable from current logic without more digging.
                    });
                    await doc.save();
                    console.log(`✅ Migrated Research: ${slug}`);
                } else {
                    // console.log(`🔹 Skipping existing Research: ${slug}`);
                }
            }
        } else {
            console.log('❌ Metadata directory not found:', metaDir);
        }


        // --- 2. Migrate Users ---
        console.log('Migrating Users...');
        const usersFile = path.join(__dirname, 'data', 'users.json');
        if (await fs.pathExists(usersFile)) {
            const users = await fs.readJSON(usersFile);
            for (const user of users) {
                const exists = await User.findOne({ email: user.email });
                if (!exists) {
                    await new User(user).save();
                    console.log(`✅ Migrated User: ${user.email}`);
                } else {
                    // console.log(`🔹 Skipping existing User: ${user.email}`);
                }
            }
        } else {
            console.log('❌ Users file not found:', usersFile);
        }

        // --- 3. Populate Categories ---
        console.log('Populating Categories...');
        const researches = await Research.find({});
        const categories = new Set();
        researches.forEach(r => {
            if (r.category_name) categories.add(r.category_name);
            else categories.add('Biology'); // Default category if not set
        });

        for (const catName of categories) {
            const exists = await Category.findOne({ name: catName });
            if (!exists) {
                await new Category({ name: catName }).save();
                console.log(`✅ Created Category: ${catName}`);
            } else {
                // console.log(`🔹 Skipping existing Category: ${catName}`);
            }
        }

        console.log(`🎉 Full Migration Complete.`);
        process.exit(0);

    } catch (err) {
        console.error('❌ Migration Failed:', err);
        process.exit(1);
    }
}

migrate();
