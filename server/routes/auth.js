const express = require("express");
const {
    authenticate
}  =require("../middleware/auth")
const router = express.Router();
const {
    login,
    logout,
    signup,
    updatePassword,
    getMe
} = require("../controllers/auth");

router.route("/login")
.post(login);

router.route("/logout")
.post(logout);

router.route("/signup")
.post(signup);

router.route("/updatepassword")
.post(updatePassword);


router.route('/getme')
.get(authenticate,getMe)


module.exports = router;