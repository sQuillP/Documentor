const asyncHandler = require("../middleware/async");
const Document = require("../models/Document");
const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const Permission = require('../models/Permission');
const mongoose = require("mongoose");



/**
 * @test: true
 * @desc: Get all documents from database
 * @route: GET api/v1/documents?findTeam=true
 * @param: findTeam => Get all documents that user is associated with.
 * @access: Private
 * NOTE: Fix the getDocuments without any params with this route.
 */
exports.getDocuments = asyncHandler( async (req,res,next)=> {
    let limit = req.params.limit;
    let documents = null;
    if(req.query.findTeam && req.query.findTeam.toLowerCase() === "true"){
        console.log('in findTeam')
        documents = Document.find({team: {$in: [req.user._id]}});
    }
    else
        documents = Document.find({author: req.user._id}).limit(limit || 50);
    documents = await documents.populate("team").populate("permissions");
    res.status(200).json({
        success: true,
        count: documents.length,
        data: documents
    });
});



/**
 * @test: true
 * @desc: Get a single document from the db
 * @route: GET /api/v1/documents/:documentid
 * @access: public
 */
exports.getDocument = asyncHandler( async(req,res,next)=> {

    let document = Document.findById(req.params.documentid)
    .populate("team")
    .populate("permissions");

    if(req.query.populateMessages){
        let tmp = req.query.populateMessages;
        console.log(req.query)
        if(tmp.toLowerCase() !== "true" && tmp.toLowerCase !== "false"){
            return next(
                new ErrorResponse(
                    `Invalid query parameters 'populateMessages' must be set to 'true' or 'false'`,
                    400
                )
            );
        }

        document = document.select('+chat');
    }

    document = await document; 

    res.status(200).json({
        success: true,
        data: document
    });
});


/**
 * @test: true
 * @desc: Create a new document for a user.
 * @route: POST /api/v1/documents
 * @access: Private
 */
exports.createDocument = asyncHandler( async (req,res,next)=> {
    let document = null;
    let generatedId = new mongoose.Types.ObjectId();
    req.body._id = generatedId;
    req.body.author = req.user._id.toString();
    req.params.documentid = generatedId;
    // console.log("USER:",req.user);
    console.log(req.body)
    const permissionsObj = [];

    if(req.body.team){
        if(!(await validatePermissionConfig(req.body)))
            return next(
                new ErrorResponse(
                    `Invalid request body`,
                    400
                )
            );

        updatePermissions(req,permissionsObj);
        document= await Document.create(req.body);
        await Permission.insertMany(permissionsObj);
    } else
        document = await Document.create(req.body);

    res.status(201).json({
        success: true,
        data: document
    });
});



/**
 * This needs cleaning up to do.
 */

/**
 * @test: true
 * @desc: Update ane existing document for a user. New permissions and members go in 
 * @route: PUT /api/v1/documents/:documentid
 * @access: Private
 */
 exports.updateDocument = asyncHandler( async (req,res,next)=> {
    
    console.log('in update document');
    console.log(req.body)
    
    if(req.body.team){
        if(!(await validatePermissionConfig(req.body)))
            return next(
                new ErrorResponse(
                    `Invalid request body`,
                    400
                )
            );
         await Permission.deleteMany({
            document: req.params.documentid
         });
         const updatedPermissions = [];
         updatePermissions(req,updatedPermissions);
         await Permission.insertMany(updatedPermissions);
    }

    

    let newDoc = await Document.findByIdAndUpdate(req.params.documentid,req.body,{
        returnDocument: "after",
        runValidators: true
    }).populate('permissions').populate('team');


    res.status(201).json({
        success: true,
        data: newDoc
    });
 });




/**
 * @test: false
 * @desc: Delete document for a user
 * @route: DELETE /api/v1/documents/:documentid
 * @access: Private
 */
 exports.deleteDocument = asyncHandler( async (req,res,next)=> {
    
    if(!req.params.documentid){
        return next(
            new ErrorResponse(
                `No documentID specified`,
                400
            )
        );
    }

    const document = await Document.findById(req.params.documentid)

    if(!document){
        return next(
            new ErrorResponse(
                `Document ${req.params.documentid} does not exist`,
                404
            )
        );
    }

    await document.remove();

    res.status(201).json({
        success: true,
        data: []
    });
});



/**
 * @param req: express request object. 
 * @param updatedPermissions: Array holding the permissions objects for db
 * @desc: adds permissions for each user in the roles array.
 */
function updatePermissions(req,updatedPermissions){
    console.log(req.body.team,
        req.body.roles);
    req.body.team.forEach( (member)=> {
        let permission = { document: req.params.documentid, user: member};
        if(req.body.roles){
            let assignedRole = req.body.roles.find( role =>
                role.user.toString() === member.toString()    
            );
            if(assignedRole)
                permission.access = assignedRole.access;
        }
        updatedPermissions.push(permission);
    });
}



/* 
*  validate permission configuration. i.e,
*  prevent duplicate roles to be assigned, assignment to users not in the team,
*  or invalid access assignments.
*  NOTE: ##Possiby move this into mongoose middleware at some point##!
*/
async function validatePermissionConfig(body){
    let accessEnum = new Set(["admin","readonly","modify"]);
    let teamSet = new Set(body.team);
    //Prevent any duplicate team members
    if(teamSet.size !== body.team.length)
        return false;
    if(body.roles){
        let roleIds = [];
        let validEnums = true;
        body.roles.forEach(role => {
            roleIds.push(role.user.toString());
            if(!accessEnum.has(role.access))
                validEnums = false;
        });
        //Return false if there are invalid enumerations.
        if(!validEnums)
            return false;
        let roleSet = new Set(roleIds);
        //Prevent duplicate id's specified in the roles object
        if(roleSet.size !== roleIds.length || roleSet.size > teamSet.size)
            return false;
        //Make sure that roles has a subset of id's in teams. i.e all role ids are contained in team array.
        let isRoleSubset = body.roles.every(role => {
            return teamSet.has(role.user.toString());
        });
        if(!isRoleSubset)
            return false;
    }
    let isValid = true;
    try{//Check to see if each specified in permissions exists.
        let resData = (await User.find({"_id": {$in: body.team} }));
        isValid = resData.length === body.team.length;
    } catch(error){return false;}
    return isValid;
} 