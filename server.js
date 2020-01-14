const express = require('express');
const path = require('path');
const winston = require("winston");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = 3035;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
  // console.log(`Socket conectado ${socket.id}`);

  // socket.emit('previousMessage', messages);

  // socket.on('sendMessage', data => {
  //   messages.push(data);
  //   socket.broadcast.emit('receivedMessage', data);
  // });
  socket.on('broadcast-notification-monitor-alert-solved', (data) => {
    console.log(data);
    io.sockets.emit('new-alert-solved-notification', {
      ...data,
      id: socket.id,
      hasChanges: true,
    });
  })
});

server.listen(port);

winston.log("info", "Server listening on localhost: " + port);
