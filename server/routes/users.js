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

// router.use("/:userid/documents",documents);

router.use(authenticate);

router.route("/")
.get(getUsers)
.post(createUser)
.delete(deleteUser);


/**Add more middleware for delete and update */
router.route("/:userid")
.get(getUser)
.put(updateUser)
.delete(deleteUser);


module.exports = router;