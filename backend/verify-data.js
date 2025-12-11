require('dotenv').config();
const mongoose = require('mongoose');
const Research = require('./models/Research');

async function testPersistence() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Cleanup previous test if exists
        await Research.deleteOne({ slug: 'test-verification-slug' });

        const newDoc = new Research({
            title: 'Test Verification Title',
            slug: 'test-verification-slug',
            abstract: 'This is a test abstract for verification.',
            authors: ['Test Author'],
            year: 2024
        });

        await newDoc.save();
        console.log('✅ Saved new document');

        const found = await Research.findOne({ slug: 'test-verification-slug' });
        if (found && found.title === 'Test Verification Title') {
            console.log('✅ Retrieved document successfully');
        } else {
            console.error('❌ Failed to retrieve document correctly');
        }

        // Cleanup
        await Research.deleteOne({ slug: 'test-verification-slug' });
        console.log('✅ Cleanup done');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

testPersistence();
