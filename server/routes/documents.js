const asyncHandler = require('../middleware/async');
const express = require('express');
const {
    getDocuments,
    getDocument,
    createDocument,
    deleteDocument,
    updateDocument
} = require("../controllers/documents");
const {
    authenticate,
    permit,
    restrict
} = require("../middleware/auth");


const permissions = require("./permissions");
const router = express.Router({mergeParams: true});

router.use("/:documentid/permissions",permissions);
router.use(authenticate);

router.route('/')
.get(getDocuments)
.post(createDocument);


router.route("/:documentid")
.get(
    permit("readonly","modify","admin"),
    getDocument
)
.put(
    permit("modify","admin"),
    updateDocument
)
.delete(
    permit("admin"),
    deleteDocument
);



module.exports = router;