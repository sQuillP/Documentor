
const {
    handleMessage
} = require("./handlers");
const mongoose = require('mongoose');
const User = require("../models/User");
const Document = require("../models/Document");
const Message = require('../models/Message');
const colors = require('colors');
/*

- when a user connects to an application, they must join to all their document 'rooms' that they are connected to.

- when they send a message, socket service will save message to the database and then send a response to the rest of the people.

- 

TODO:
-- create an endpoint that will 

*/

const logged_in_users = new Set();


function handleSockets(io){

    /**
     * 
     * message = {author:objectId, content:string, seenBy:string, createdAt}
     * message = {author:objectId, name:string, image:string, content:string, seenBy:[objectId], createdAt:Date}
     */
    
    io.on("connection",(socket)=> {

        console.log('connected user');

        socket.on('send-message', async (room,message)=> {
            const id = new mongoose.Types.ObjectId();
            message['_id'] = id;
            console.log(room, message);
            const document = await Document.findById(room).select("+chat");
            document.chat.push(message);
            await document.save();
            io.in(room).emit('receive-message',message);
        });

        //string should be coming in to the document
        socket.on('modify-document',(roomId,documentContent)=> {
            console.log(documentContent);
            socket.to(roomId).emit('add-document-changes',documentContent);
        });

        socket.on('connect-user', async (userId)=>{
            let user = await User.findById(userId);
            // if(logged_in_users.has(user_id)) return ;

            // logged_in_users.add(user._id);

            let sharedDocuments = await Document.find({team: {$in: [userId]}});
            let personalDocuments = await Document.find({author: userId});

            let idSet = new Set();

            for(const document of sharedDocuments)
                idSet.add(document._id.toString());

            for(const document of personalDocuments)
                if(document.team.length !==0)
                    idSet.add(document._id.toString());
            
            console.log(('for user: '+user.email).green.bold);
            for(let id of idSet){
                socket.join(id);
                console.log('joining socket ',id);
            }
        });

        // socket.on('disconnect',()=>{
        //     logged_in_users.delete('')
        // })

    });


}


module.exports = handleSockets;