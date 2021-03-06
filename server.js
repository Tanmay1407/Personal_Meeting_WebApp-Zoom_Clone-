const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const {v4 : uuidv4} = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug : true
});


app.set('view engine' , 'ejs');
app.use(express.static('public'));

app.use('/peerjs',peerServer);
app.get("/", function(req,res){
    
  res.redirect(`/${uuidv4()}`);
})

app.get("/:room", function(req,res){
    res.render('room',{roomId : req.params.room});
})


server.listen(process.env.PORT ||3000,function(){
    console.log("Server started at port 3000");
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
   
    socket.to(roomId).emit('user-connected', userId);

     socket.on('message', (msg)=>{
       io.to(roomId).emit('createMessage', msg);
     })


    })
})
