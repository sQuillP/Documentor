
const {
    handleMessage
} = require("./handlers");


const User = require("../models/User");
const Document = require("../models/Document");
const Message = require('../models/Message');
/*

- when a user connects to an application, they must join to all their document 'rooms' that they are connected to.

- when they send a message, socket service will save message to the database and then send a response to the rest of the people.

- 

TODO:
-- create an endpoint that will 

*/

function handleSockets(io){

    /**
     * 
     * message = {author:objectId, content:string, seenBy:string, createdAt}
     * 
     */
    
    io.on("connection",(socket)=> {

        console.log('connected user');
        io.to(socket.id).emit('receive-message',"Hello from server");
        socket.on('send-message', async (room,message)=> {
            const id = new mongoose.Types.ObjectId();
            message['_id'] = id;
            const document = await Document.findById(room);
            document.chat.push(message);
            await document.save();
            io.to(room).emit('receive-message',message);
        });

        socket.on('connect-user', async (userId)=>{
            console.log('firing connect user');
            let documents = await Document.find({team: {$in: [userId]}});
            for(let document of documents){
                socket.join(document._id);
                console.log('joining socket ',document._id);
            }
        });

    });


}


module.exports = handleSockets;