const express = require("express");
const router = express.Router();
const {
    login,
    logout,
    signup
} = require("../controllers/auth");

router.route("/login")
.post(login);

router.route("/logout")
.post(logout);

router.route("/signup")
.post(signup);


module.exports = router;