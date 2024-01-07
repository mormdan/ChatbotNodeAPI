const express = require('express');
const app = express()


// bring in routes
const postRouter = require('./routes/post');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

dotenv.config();
//db
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true }).then(()=>console.log("Database Connected Successfully."));
mongoose.connection.on('error', err => {console.log(`Database Connection Failed: ${err.message}`)});


const myOwnMiddleWare = (req, res, next) => 
{
    console.log("MiddleWare Applied !");
    next();
}

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
//app.use(myOwnMiddleWare);



app.use('/', postRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Server is listening on port: ${port}`)});