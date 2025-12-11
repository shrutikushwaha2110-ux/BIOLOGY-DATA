require('dotenv').config();
const mongoose = require('mongoose');
const Research = require('./models/Research');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected');
        console.log('Using Database:', mongoose.connection.name);

        const count = await Research.countDocuments();
        console.log('Research Document Count:', count);

        if (count > 0) {
            const sample = await Research.findOne();
            console.log('Sample Doc Title:', sample.title);
        } else {
            console.log('⚠️ Database is empty!');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkData();
