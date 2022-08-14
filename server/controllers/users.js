const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");


/**
 * File has been tested
 */
 
/**
 * @tested: true
 * @desc: Get all users from the database.
 * @route: GET /api/v1/users
 * @access: Public
 */
exports.getUsers = asyncHandler( async(req,res,next)=> {
    
    const limit = req.query.limit || 100;
    const users = await User.find().limit(limit);

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});


/**
 * @tested: true
 * @desc: Get single user from the database.
 * @route: GET /api/v1/users/:userid
 * @access: Public
 */
exports.getUser = asyncHandler( async (req,res,next)=> {
    if(!req.params.userid){
        return next(
            new ErrorResponse(
                `No userid parameter specified`,
                400
            )
        );
    }

    const user = await User.findById(req.params.userid);

    if(!user){
        return next(
            new ErrorResponse(
                `User ${req.params.userid} does not exist`,
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        data: user
    });
});



/**
 * @tested: true
 * @desc: Get all users from the database.
 * @route: PUT /api/v1/users/:userid
 * @access: Private
 */
 exports.updateUser = asyncHandler( async (req,res,next)=> {

    if(!req.params.userid){
        return next(
            new ErrorResponse(
                `No userid parameter specified`,
                400
            )
        );
    }

    if(!(await User.findById(req.params.userid)))
        return next(
            new ErrorResponse(
                `User ${req.params.userid} does not exist`,
                404
            )
        );

    const user = await User.findByIdAndUpdate(req.params.userid,req.body, {
        runValidators: true,
        returnDocument: "after"
    });

    res.status(201).json({
        success: true,
        data: user
    });
});


/**
 * @tested: true
 * @desc: Create user in the database
 * @route: POST /api/v1/users
 * @access: Private
 */
 exports.createUser = asyncHandler( async (req,res,next)=> {

    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});



/**
 * @tested: true
 * @desc: Delete a user from the database
 * @route: DELETE /api/v1/users/:userid
 * @access: Public
 */
 exports.deleteUser = asyncHandler( async (req,res,next)=> {
    if(!req.params.userid){
        return next(
            new ErrorResponse(
                `No userid parameter specified`,
                400
            )
        );
    }

    const user = await User.findById(req.params.userid);

    if(!user){
        return next(
            new ErrorResponse(
                `User ${req.params.userid} not found`,
                404
            )
        );
    }

    await user.delete();

    res.status(200).json({
        success: true,
        data: []
    });
});
