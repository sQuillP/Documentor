const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,` Please specify a name`],
    },
    email: {
        type: String,
        match:  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: [true, ` Please specify an email`],
        unique: true
    },
    password: {
        type: String,
        minLength: [6,` password: '{VALUE}' must be at least 6 characters`],
        required: [true, ` Must specify a password`],
        select: false
    },
    image:{
        type:String,
    },
    position:{
        type: String,
        enum: ["user","administrator"],
        default: "user",
        select: false
    }
});


UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
}

UserSchema.pre("save",function(next){
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
    next();
});

UserSchema.methods.validatePassword = function(plaintextPassword){
    return bcrypt.compareSync(plaintextPassword, this.password);
}



const User = mongoose.model("User",UserSchema);
module.exports = User;