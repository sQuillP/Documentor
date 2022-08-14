const mongoose = require("mongoose");

/**
 * Each team member of a document is given a permission that describes their access to
 * the document.
 */
const PermissionSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.ObjectId,
        ref: "Document",
        required: [true,`Please reference a document for added permission`]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, `Please specify a user for added permission`]
    },
    access: {
        type: String,
        enum: {
            values: ["readonly", "modify", "admin"],
            message: "{VALUE} is not a valid role"
        },
        default: "readonly",
    }
});

const Permission = mongoose.model("Permission",PermissionSchema);
module.exports = Permission;