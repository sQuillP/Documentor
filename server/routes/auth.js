const express = require("express");
const router = express.Router();
const {
    login,
    logout,
    signup,
    updatePassword
} = require("../controllers/auth");

router.route("/login")
.post(login);

router.route("/logout")
.post(logout);

router.route("/signup")
.post(signup);

router.route("/updatepassword")
.post(updatePassword);


module.exports = router;