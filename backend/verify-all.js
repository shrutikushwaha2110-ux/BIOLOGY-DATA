require('dotenv').config();
const mongoose = require('mongoose');
const Research = require('./models/Research');
const User = require('./models/User');
const Category = require('./models/Category');

async function checkAll() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected');

        const rCount = await Research.countDocuments();
        const uCount = await User.countDocuments();
        const cCount = await Category.countDocuments();

        console.log(`\n📊 Research Count: ${rCount}`);
        const latestResearch = await Research.find().sort({ createdAt: -1 }).limit(5);
        latestResearch.forEach(r => console.log(`   - ${r.title} (${r.slug})`));

        console.log(`\n👤 User Count: ${uCount}`);
        const users = await User.find();
        users.forEach(u => console.log(`   - ${u.email} (${u.role})`));

        console.log(`\nwm Category Count: ${cCount}`);
        const categories = await Category.find();
        categories.forEach(c => console.log(`   - ${c.name}`));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkAll();
