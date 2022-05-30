const mongoose = require('mongoose');

module.exports = mongoose.model('users', new mongoose.Schema([{
    email: { type: String, lowercase: true, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: Number, min: 10, required: true, unique: true },
    type: { type: String, enum: ['FACULTY', 'STUDENT'], required: true },
    isActive: { type: Boolean, required: true }
}], {
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
}
));