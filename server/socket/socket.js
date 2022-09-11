
const {
    handleMessage
} = require("./handlers");


const User = require("../models/User");
const Document = require("../models/Document");
/*

- when a user connects to an application, they must join to all their document 'rooms' that they are connected to.

- when they send a message, socket service will save message to the database and then send a response to the rest of the people.

- 

TODO:
-- create an endpoint that will 

*/

function handleSockets(io){

    
    io.on("connection",(socket)=> {

        io.to(socket.id).emit('receive-message',"Hello from server");
        socket.on('send-message',(room,message)=> {
            socket.to(room).emit('receive-message',message);
        });

        socket.on('connect-user', async (userId)=>{
            let documents = await Document.find({team: {$in: [userId]}});
            for(let document of documents){
                socket.join(document._id);
                console.log('joining socket ',document._id);
            }
        });

    });


}


module.exports = handleSockets;