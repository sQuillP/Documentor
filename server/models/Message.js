const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: [true,`Please specify author`],
    },
    content:{
        type:String,
        default: ""
    },
    seenBy:{
        type: [mongoose.Schema.ObjectId],
        ref:"User"
    },
    createdAt:{
        type:Date,
        expires: 86400,
        default: Date.now 
    }
});

module.exports = MessageSchema;




