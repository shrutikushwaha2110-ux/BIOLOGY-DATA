require('dotenv').config();
const mongoose = require('mongoose');
const Research = require('./models/Research');

async function fixSlugs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected');

        // Mapping: Current Slug -> Target Slug (from Frontend)
        const updates = {
            'genome_sequencing_costs': 'genome_cost',
            'national_genome_projects_across_the_globe': 'genome_projects',
            'gwas_diversity': 'gwas_diversity', // Already correct? checking explicitly
            'pbw_resistance_damage_bt_cotton_india': 'pbw_damage_cotton_india'
        };

        for (const [current, target] of Object.entries(updates)) {
            if (current === target) continue;

            const doc = await Research.findOne({ slug: current });
            if (doc) {
                // Check if target already exists (collision)
                const collision = await Research.findOne({ slug: target });
                if (collision) {
                    console.log(`⚠️ Target slug "${target}" already exists. Skipping rename of "${current}".`);
                    // Optional: decide what to do, maybe delete the old one? 
                    // For now, let's just log it.
                } else {
                    doc.slug = target;
                    await doc.save();
                    console.log(`✅ Renamed: "${current}" -> "${target}"`);
                }
            } else {
                console.log(`⚠️ Original slug "${current}" not found.`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fixSlugs();
