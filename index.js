const express = require('express');
const  connectDB = require("./config/db.js");
const path = require("path");
const dotenv= require("dotenv");
const bodyParser =require('body-parser');
const cors = require('cors');
// const  config = require("./config/default.json");
const userRoutes = require("./routes/userRoutes.js");
const tweetRoutes=  require("./routes/tweetRoutes.js");
const commentRoutes = require("./routes/commentRoutes.js");
// const elasticClient = require('./config/elasticSearch')
const { errorHandler, notFound }= require("./middleware/errorMiddleware.js");
const fileUpload = require('express-fileupload');
// const port = 5020;

dotenv.config();
connectDB();
const app = express();
app.use(cors({origin: '*'})); 
// app.options('*',cors())
app.use(bodyParser.urlencoded({
  extended:true
}))
app.use(fileUpload());
app.use(express.json()); 
app.use("/api/v1.0/tweets", tweetRoutes);
app.use("/api/v1.0/tweets", userRoutes);
app.use("/api/v1.0/tweets",commentRoutes);

app.use(notFound);
app.use(errorHandler);
app.get("/healthCheck", async (req, res)=>{
    res.send("Welcome to this test interface");
})

const server = require('http').createServer(app)
app.use((req, res, next)=>{
req.socket.on('error', () => {});
next()
});

server.on('listening', ()=>{
  console.log('server is runnig')
})

const PORT = process.env.PORT || config.application_serverport;

server.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}..`
  )
);

// app.listen(port, ()=>{
//     console.log(`app running on port ${port}!!`);
// })