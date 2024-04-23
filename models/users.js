const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

// Apply a transformation to ensure that the friends list only includes the specified fields
userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.__v;  // Remove the version key from the output
        if (ret.friends && !options.minimizeFriends) {
            // Modify the friends array to include only _id and username
            ret.friends = ret.friends.map(friend => {
                return {
                    _id: friend._id,
                    username: friend.username
                };
            });
        }
        return ret;
    }
});

// Virtual for friendCount to calculate the number of friends
userSchema.virtual('friendCount').get(function() {
    return this.friends ? this.friends.length : 0;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
