const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

// Schema to create a Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1, // minimum is 1 character
            maxLength: 280, // maximum is 280 characters
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        userName: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema], // array of nested documents created using the reactionSchema
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

userSchema.virtual('reactionCount').get(function(){ // virtual to get amount of how many reactions a thought has
    return this.reactions.length;
});


// Initialize our Thought model
const Thought = model('thought', thoughtSchema);
module.exports = Thought;