const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, unique: true }, // Keeping string ID from JSON to match legacy
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'user' },
    name: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
