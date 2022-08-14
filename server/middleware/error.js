const ErrorResponse = require("../utils/ErrorResponse");


const errorHandler = (error,req,res,next)=>{

    console.log(error.message, error.name)
    if(error.code === 11000){
        let message = "Duplicate field error"
        error = new ErrorResponse(message, 400);
    } else if(error.name === "CastError"){
        const message = "CastError, likely invalid ID";
        error = new ErrorResponse(message, 400);
    } else if(error.name === 'ValidationError'){
        const message = Object.values(error.errors).map(value =>{
            return value.message
        });
        error = new ErrorResponse(message,400);
    }


    res.status(error.status || 500).json({
        success: false,
        message: error.message || "Unable to process request | internal server error"
    });
}


module.exports = errorHandler;