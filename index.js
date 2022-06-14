const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var users = [];
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    // socket.broadcast.emit('chat message', "userconnected");

    socket.on('disconnect', () => {
        socket.broadcast.emit('chat message', `${users[socket.id]} left the chat`);
        socket.broadcast.emit('left-the-chat', socket.id);
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', `${users[socket.id]}:${msg}`);


    });
    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;

        socket.broadcast.emit('chat message', `${users[socket.id]} joined the chat`);
        io.emit('new-user-joined', [name, socket.id]);
        socket.data.username = name;
    })

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});