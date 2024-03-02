const { Schema, model } = require('mongoose');

var validateEmail = function(email) { // test email using regex and test meothod
    return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email); 
};

// Schema to create a User Model
const userSchema = new Schema(
    {
        userName: {
            type: String,
            unique: true, // tells mongoose the userName must be unique (will put out error for users with same name)
            required: true,
            trim: true, // gets rid of spaces in beginning (so " hello " would be "hello")
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validator: [validateEmail, 'Please use a valid email address!'], // if function is true continue, else if false send out error message
        },
        thoughts: [ // Each user has an array of thoughts
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

userSchema.virtual('friendCount').get(function(){ // virtual to get amount of how many friends a user has
    return this.friends.length;
});

// Initialize our User model
const User = model('user', userSchema);
module.exports = User;