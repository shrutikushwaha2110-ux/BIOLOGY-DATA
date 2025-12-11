require('dotenv').config();
const mongoose = require('mongoose');
const Research = require('./models/Research');

async function listSlugs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const allResearch = await Research.find({}, 'title slug');
        console.log('Current Slugs:');
        allResearch.forEach(r => console.log(`"${r.slug}" (Title: ${r.title})`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listSlugs();
