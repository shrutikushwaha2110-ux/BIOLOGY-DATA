require('dotenv').config();
const mongoose = require('mongoose');

console.log('--- DEBUG START ---');
const uri = process.env.MONGO_URI || '';
console.log('Type of URI:', typeof uri);
console.log('Length of URI:', uri.length);

if (uri.length > 0) {
    // Mask password for logging
    const masked = uri.replace(/:([^:@]+)@/, ':****@');
    console.log('Loaded URI (Masked):', masked);

    // Check for "shruti21" explicitly to see if it's there
    if (uri.includes('shruti21')) {
        console.log('Password "shruti21" found in URI.');
    } else {
        console.log('Password "shruti21" NOT found in URI.');
    }
} else {
    console.log('URI is empty!');
}

console.log('Attempting connection...');
mongoose.connect(uri)
    .then(() => {
        console.log('✅ Connected!');
        process.exit(0);
    })
    .catch(err => {
        console.log('❌ Connection Failed');
        console.log('CodeName:', err.codeName);
        console.log('Code:', err.code);
        console.log('Message:', err.message);
        if (err.errorResponse) {
            console.log('Full Response:', JSON.stringify(err.errorResponse, null, 2));
        }
        process.exit(1);
    });
