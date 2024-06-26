// models/thoughts.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Reaction Schema
const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    reactionBody: { type: String, required: true, maxlength: 280 },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, get: createdAtVal => createdAtVal.toLocaleString() }
}, {
    toJSON: { getters: true }
});

// Thought Schema
const thoughtSchema = new Schema({
    thoughtText: { type: String, required: true, minlength: 1, maxlength: 280 },
    username: { type: String, required: true }, // This should reference User if users are modeled
    reactions: [reactionSchema]
}, {
    toJSON: { virtuals: true, getters: true },
    id: false
});

// Virtual for reactionCount
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);
module.exports = Thought;
