import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 
    joinedAt: {
        type: Date,
        default: Date.now(),
    }
}, {
    // chỉ dùng schema để làm type nên kh cần id
    _id: false,
})

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    _id: false,
})

const lastMessageSchema = new mongoose.Schema({
    // id của tin nhắn gốc, không phải id của mongoose tạo
    _id: {
        type: String,
    },
    content: {
        type: String,
        default: null,
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: null,
    }

}, {
    _id: false,
})

const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["direct", "group"],
        required: true,
    },
    participants: {
        type: [participantSchema],
        required: true,
    },
    group: {
        type: groupSchema,
    },
    lastMessageAt: {
        type: Date,
    },
    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    lastMessage: {
        type: lastMessageSchema,
        default: null,
    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {},
    }
}, {
    timestamps: true,
});

conversationSchema.index({
    // tạo sao participant mà kh có s
   "participant.userId": 1, lastMessageAt:1,

})

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;