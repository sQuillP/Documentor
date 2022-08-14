const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const Permission = require("../models/Permission");
const User = require("../models/User");
const Document = require("../models/Document");


/**
 * @tested: true
 * @desc: Get all permissions objects from db
 * @route: GET /api/v1/permissions
 * @route: GET /api/v1/documents/:documentid/permissions
 * @access: Public
 */
exports.getPermissions = asyncHandler( async (req,res,next)=> {

    let query = null;
    const limit = req.query.limit || 100;

    if(req.params.documentid){
        query = Permission.find({
            document: req.params.documentid
        });
    } else
        query = Permission.find();

    if(req.query.populate)
        query = query.populate("user");
    
    query = query.limit(limit);

    let permissions = await query;

    res.status(200).json({
        success: true,
        count: permissions.length,
        data: permissions
    });
});



/**
 * @tested: true
 * @desc: Get single permission from db
 * @route: GET /api/v1/permissions/:permissionid
 * @access: Public
 */
 exports.getPermission = asyncHandler( async (req,res,next)=> {

    if(!req.params.permissionid){
        return next(
            new ErrorResponse(
                `Permission id not specified`,
                400
            )
        );
    }

    const permission = await Permission.findById(req.params.permissionid);

    if(!permission){
        return next(
            new ErrorResponse(
                `Permission ${req.params.permissionid} does not exist`,
                404
            )
        );
    }



    res.status(200).json({
        success: true,
        data: permission
    });
});


/**
 * @tested: true
 * @desc: Create a new permission in the db
 * @route: POST /api/v1/permissions
 * @access: Restricted
 */
 exports.createPermission = asyncHandler( async (req,res,next)=> {

    if(!(await Document.findById(req.body.document)))
        return next(
            new ErrorResponse(
                `Permission for document id of ${req.body.document} does not exist`,
                404
            )
        );

    if(!(await User.findById(req.body.user)))
                return next(
                    new ErrorResponse(
                        `Permission for user id of ${req.body.user} does not exist`,
                        404
                    )
                );

    const permission = await Permission.create(req.body);


    res.status(200).json({
        success: true,
        data: permission
    });
});


/**
 * @tested: true
 * @desc: Update permission object in db
 * @route: PUT /api/v1/permissions/:permissionid
 * @access: Private, must be an admin of document.
 */
 exports.updatePermission = asyncHandler( async (req,res,next)=> {

    

    const permission = await Permission
    .findByIdAndUpdate(req.params.permissionid,req.body,{
        runValidators: true,
        returnDocument: "after"
    });

    if(!permission)
        return next(
            new ErrorResponse(
                `Permission ${req.params.permissionid} does not exist`,
                404
            )
        );

    res.status(200).json({
        success: true,
        data: permission
    });
});



/**
 * @tested: true
 * @desc: Delete permission from database
 * @route: DELETE /api/v1/permissions/:permissionid
 * @access: Private, must be admin of document
 */
 exports.deletePermission = asyncHandler( async (req,res,next)=> {

    if(!req.params.permissionid){
        return next(
            new ErrorResponse(
                `Permission ${req.params.permissionid} does not exist`,
                404
            )
        )
    }
    const permission = await Permission.findById(req.params.permissionid);
    if(!permission){
        return next(
            new ErrorResponse(
                `Permission ${req.params.permissionid} does not exist`,
                404
            )
        )
    }

    await permission.remove();

    res.status(200).json({
        success: true,
        data: []
    });
});