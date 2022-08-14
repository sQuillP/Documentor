/* Libs */
const express = require('express');
const app = express();
const colors = require("colors");
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");

/* Routes */
const documents = require("./routes/documents");
const users = require("./routes/users");
const permissions = require("./routes/permissions");
const auth = require("./routes/auth");
const errorHandler = require("./middleware/error");

/* Load middleware*/
dotenv.config({path: "./config/config.env"});
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

/* Database connection */
const loadDB = require("./config/db");
loadDB();

/* Mount routes */
app.use("/api/v1/documents",documents);
app.use("/api/v1/users",users);
app.use("/api/v1/permissions",permissions);
app.use("/api/v1/auth",auth);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(5000, ()=> {
    console.log(`Server running on port ${PORT}`.green.bold);
});