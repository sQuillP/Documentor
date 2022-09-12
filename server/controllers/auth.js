const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");


const COOKIE_EXP = 1000*60*60*24*30;

/**
 * @test: false
 * @desc: Send JWT token after setting correct username and password
 * @route: POST /api/v1/auth/login
 * @access: Public
 */
exports.login = asyncWrapper( async (req,res,next)=> {

    // Get the user from teh database
    const user = await User.findOne({email: req.body.email}).select("+password");
    
    if(!user || !user.validatePassword(req.body.password))
        return next(
            new ErrorResponse(
                `Invalid email or password`,
                400
            )
        );

    const token = user.getSignedJwtToken();
    
    res.status(200)
    .cookie("token",token,{
        maxAge: COOKIE_EXP,
        httpOnly: true
    })
    .json({
        success: true,
        data: token
    });
});


/*
* @test: false
* @desc: Get the account details associated with the logged in user
* @route: GET /api/v1/auth/getMe
* @access: private
*/
exports.getMe = asyncWrapper( async(req,res,next)=> {
    const me = await User.findById(req.user._id);
    res.status(200).json({
        success:true,
        data: me
    });
});


/**
 * @test: false
 * @desc: Create a new user and send JWT token for authentication
 * @route: POST /api/v1/auth/login
 * @access: Public
 */
 exports.signup = asyncWrapper( async (req,res,next)=> {

    // Get the user from the database
    console.log(req.body)
    const createdUser = await User.create(req.body);

    const token = createdUser.getSignedJwtToken();
    
    res.status(200).cookie("token",token,{
        maxAge: COOKIE_EXP,
        httpOnly: true
    }).json({
        success: true,
        data: token
    });
});



/**
 * @test: false
 * @desc: Log a user out of their account, clear their browser cookies
 * @route: POST /api/v1/auth/login
 * @access: Private
 */
 exports.logout = asyncWrapper( async (req,res,next)=> {


    res.clearCookie("token");

    res.status(200).json({
        success: true,
        data: []
    });
});


/**
 * @test: false
 * @desc: Change the password of a current user.
 * @route: POST /api/v1/auth/updatepassword
 * @access: Private
 */
 exports.updatePassword = asyncWrapper( async (req,res,next)=> {

    const user = User.findById(req.user._id).select("+password");


    if(!user.validatePassword(req.body.oldPassword))
        return next(
            new ErrorResponse(
                `Invalid password`,
                401
            )
        );
    
    user.password = req.body.newPassword

    const token = user.getSignedJwtToken();

    await user.save();

    res.status(200).cookie("token",token).json({
        success: true,
        data: token
    });
});