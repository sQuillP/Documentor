const express = require("express");
const router = express.Router({mergeParams: true});
const {
    getUser,
    getUsers,
    updateUser,
    createUser,
    deleteUser,
} = require('../controllers/users');
const {
    authenticate,
} = require("../middleware/auth");

const documents = require('./documents');

router.use("/:userid/documents",documents);

router.route("/")
.get(getUsers)
.post(createUser)
.delete(deleteUser);

router.route("/:userid")
.get(getUser)
.put(updateUser)
.delete(deleteUser);


module.exports = router;