require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.log('❌ Connection Failed!');
        console.log('Error Name:', err.name);
        console.log('Error Message:', err.message);
        process.exit(1);
    });
