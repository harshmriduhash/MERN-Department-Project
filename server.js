const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');




const app = express();

const server = require('http').Server(app);
const io = require('socket.io').listen(server);
app.set('server',server);
io.set('origins', '*:*');

var notifClients = {};
app.set("sockets", notifClients);
var nsp = io.of("/request");
// connection establishment
nsp.on("connect", function(clientSocket) {
  clientSocket.on("initClientInfo", function(data) {
     console.log("-------------------initial client info for socket---------------",data)
    notifClients[data.userId] = clientSocket;
    // console.log('a user connected')
    app.set("sockets", notifClients);
  });
  // on socket disconnect
  clientSocket.on("disconnect", function(reason) {
    var req_socket_uid = Object.keys(notifClients).filter(function(key) {
      return notifClients[key].id === clientSocket.id;
    })[0];
    delete notifClients[req_socket_uid];
  });
});









//router
const authRouter = require('./routes/auth');
const departmentRouter = require('./routes/department');
const requestRouter = require('./routes/request');



//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use(passport.initialize());
require('./config/passport')(passport);


//MongoDb connection
// const mongoURI = require('./config/keys').mongoURI;
let mongoURI = ''
if(process.env.NODE_ENV === 'production'){
    mongoURI = "mongodb://anup:switch027app@ds151523.mlab.com:51523/switch-on-app";
}else{
    mongoURI = 'mongodb://localhost:27017/switchOn'
}

mongoose.connect(mongoURI)
    .then(console.log("MongoDb Successfully connected"))
    .catch(err => console.log(err));





app.use('/api/users', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/request', requestRouter);



if(process.env.NODE_ENV === 'production'){
    app.use(express.static("client/build"));
    app.get('*',(req,res) =>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}



// console.log('check app==================', app);
const socketApp = app;
// console.log('check socket===========', socketApp);
server.socketApp = socketApp;



const port = process.env.PORT || 8000;

server.listen(port, () => console.log(`Server running on port ${port}`));




exports.socketData = notifClients;

exports = module.exports = server;


