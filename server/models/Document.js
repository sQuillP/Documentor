const mongoose = require("mongoose");

/**
 * Author has all privileges and cannot have their permissions revoked.
 */


/**
 * - When user is invited to a document, they get standard permissions attached to that document.
 * - users can change other user permissions if they have the proper permission to do so.
 * 
 */
const DocumentSchema = new mongoose.Schema({

    title:{
        type: String,
        default: "No title"
    },
    author: {
        type: mongoose.Schema.ObjectId,
        required: [true, `Please specify author`],
        ref: "User"
    },
    team: {
        type: [mongoose.Schema.ObjectId],
        ref: "User",
        maxLength: [12, `Team members limited to 12`],
        default: []
    },
    content: {
        type: String
    },
},{
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});


DocumentSchema.pre("save",function(next){
    if(!this.title)
        this.title = "No Title"
    next();
});


/* Cascade delete permissions when document is deleted. */
DocumentSchema.pre('remove', async function(next){
    await this.model("Permission").deleteMany({document: this._id});
    next();
});


DocumentSchema.virtual('permissions',{
    ref: "Permission",
    localField: "_id",
    foreignField: "document"
});

const Document = mongoose.model("Document",DocumentSchema);
module.exports = Document;