const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, 'Please enter username'],
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Please enter email'],
            match: [/.+\@.+\..+/, 'is invalid'], 
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'

            }
        ],
        friends:  [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'

            }
        ]
    },
    {
        toJSON: {
            virtuals: true, 
            getters: true
        },

        // prevents virtuals from creating duplicate of _id as `id`
        id: false
    }
);

// get total count of user's friends on retrieval
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

//export user module

module.exports = User;