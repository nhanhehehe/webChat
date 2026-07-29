import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        maxLength: 300,
    }
}, {
}, {
    timestamps: true,
})

friendRequest.index({"from": 1, "to": 1}, {unique: true});

friendRequest.index({"from": 1});
friendRequest.index({"to": 1});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;