const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserData' }],
        incomingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserData' }],
        outgoingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserData' }],
        profilePicture: { type: String, default: '' }, // Add this line
        about:{type: String}
    
    },
    { collection: 'user-data' }
);

const UserModel = mongoose.model('UserData', UserSchema);

module.exports = UserModel;
