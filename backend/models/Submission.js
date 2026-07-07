const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code:      { type: String, required: true },
    output:    { type: String },
    status:    { type: String, enum: ['Success', 'Error', 'Time Limit Exceeded'], default: 'Success' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
