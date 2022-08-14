const mongoose = require("mongoose");
const colors = require("colors");



const connect = async ()=>{
    try{
        const connection = await mongoose.connect(process.env.DB_URI);
        console.log("Connected to databse".cyan.underline.bold);
    } catch(error){
        console.log("Server connection failed. Please check Database URI for connection problems.".red.inverse);
        process.exit();
    }
}


module.exports = connect;
