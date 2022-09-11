/* Libs */
const express = require('express');
const app = express();
const colors = require("colors");
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const socketIO = require("socket.io");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
/* Routes */
const documents = require("./routes/documents");
const users = require("./routes/users");
const permissions = require("./routes/permissions");
const auth = require("./routes/auth");
const errorHandler = require("./middleware/error");

/* Load Sockets */
const handleSockets = require("./socket/socket");

/* Load middleware*/
dotenv.config({path: "./config/config.env"});
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(helmet());
app.use(cors({origin:["http://localhost:4200"]}));

/* Database connection */
const loadDB = require("./config/db");
loadDB();

/* Mount routes */
app.use("/api/v1/documents",documents);
app.use("/api/v1/users",users);
app.use("/api/v1/permissions",permissions);
app.use("/api/v1/auth",auth);
app.use(errorHandler);


const socketServer = http.Server(app);
const PORT = process.env.PORT || 5000;
socketServer.listen(PORT);
 
io = socketIO(socketServer,{cors:['http://loclahost:4200']});

console.log(process.env.PORT)

handleSockets(io);
//handleSockets(io);