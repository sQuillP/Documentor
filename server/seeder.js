const mongoose = require("mongoose");
const colors = require("colors");
const Document = require('./models/Document');
const Permission = require('./models/Permission');
const User = require('./models/User');
const dotenv = require('dotenv');
const fs = require('fs');


dotenv.config({path: "./config/config.env"});

mongoose.connect(process.env.DB_URI, ()=>{
    console.log('connected to db')
});




const clearDB = async ()=> {
    try{
        await User.deleteMany();
        await Permission.deleteMany();
        await Document.deleteMany();
        console.log("Database has been cleared".red.inverse);
        process.exit();
    } catch(error){
        console.log('Unable to clear database'.red.bold);
    }
}

// 
const users = [];
const seedDB = async ()=> {
    try{
        await User.insertMany(users);
    } catch(error){

    }
}



if(process.argv[2] === '-d')
    clearDB();
else if(process.argv[2] ==='-i')
    seedDB();
else{
    console.log("USE: node seeder.js -<d|i>".yellow.bold);
    process.exit();
}