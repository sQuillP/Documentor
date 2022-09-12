const Permission = require("../models/Permission");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const Document = require("../models/Document");
const mongoose = require('mongoose')

/**
 * @desc: Make sure user is logged in before accessing route
 */
exports.authenticate = async (req,res,next)=> {
    if(!req.headers.authorization)
        return next(
            new ErrorResponse(
                `Access to this route requires auth token`,
                401
            )
        );
    const token = req.headers.authorization.split(" ");
    if(token[0].toLowerCase() !== "bearer")
        return next(
            new ErrorResponse(
                `Invalid token format. Please specify as follows -> 'Bearer <authToken>'`,
                400
            )
        );
    
        try{
            const decoded = jwt.verify(token[1],process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("+position");
        } catch(error){
            console.log(error);
                return next(
                    new ErrorResponse(
                        `Invalid token`,
                        401
                    )
                );
        }
        next();
}


/**
 * @router: documents.js
 * @desc: Allow document access to users with corresponding permissions
 */
exports.permit = (...permissions) => async (req,res,next)=> {
    if(req.params.documentid){
        if(!mongoose.Types.ObjectId.isValid(req.params.documentid))
            return next(
                new ErrorResponse(
                    `Invalid document id`,
                    400
                )
            )
        const document = await Document.findById(req.params.documentid);
        if(!document)
            return next(
                new ErrorResponse(
                    `Document ${req.params.documentid} does not exist`,
                    404
                )
            );
        if(req.user.id.toString() === document.author.toString())
            return next();
        const permission = await Permission.findOne({
            user: req.user._id,
            document: req.params.documentid
        });
        if(!permission || !permissions.includes(permission.access)){
            return next(
                new ErrorResponse(
                    `Insufficient permissions`,
                    401
                )
            );
        }
    } else if(req.user.position !== "administrator"){
        return next(
            new ErrorResponse(
                `Access denied`,
                403
            )
        );
    }
    next();
}



/**
 * @router: permissions.js
 * @desc: Protect route from being accessed by non-team members, or by members who do not 
 *        have sufficient privileges.
 */
exports.guardPermission = (...roles) => async (req,res,next)=> {
    let permission = null;
    if(req.params.documentid){
        permission = Permission.findOne({user: req.user._id, document: req.params.documentid});
        if(!permission || !roles.includes(permission.access))
            return next(
                new ErrorResponse(
                    `Insufficient permissions`,
                    400
                )
            );
    }
    else{
        try{
            console.log(req.params.permissionid, req.user)
            const reqPermission = await Permission.findOne({user: req.user._id});
            permission = await Permission.findById(req.params.permissionid);
            console.log(reqPermission, permission);
            if(!reqPermission|| !permission || reqPermission.document.toString() !== permission.document.toString() || !roles.includes(reqPermission.access))
                return next(
                    new ErrorResponse(
                        `Insufficient permissions`,
                        401
                    )
                );
            console.log("reached here aslo")
        } catch(error){
            console.log(error)
            return next(
                new ErrorResponse(
                    `Invalid request`,
                    400
                )
            );
        }
    }
    next();

}


/**
 * @desc: prevent any user from accessing restricted routes 
 *  i.e messing with routes that manipulate db objects.
 */
exports.restrict = (req,res,next)=>{
    if(req.user.position !== "administrator")
        return next(
            new ErrorResponse(
                `Access denied`,
                403
            )
        );
    next();
}