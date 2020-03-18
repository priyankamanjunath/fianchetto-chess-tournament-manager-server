const app = require('http').createServer(handler);
const io = require('socket.io')(app, {transports: ['polling']});
const fs = require('fs');

port = process.env.PORT || 8080
app.listen(port);

function handler (req, res) {
  let filePath = req.url;
  if (req.url === '/') filePath = '/templates/index.html';
  fs.readFile(__dirname + filePath, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading' + filePath + ': ' + err);
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {

  socket.on('users:get', function(data) {
    console.log('response_users:get: ', data);
    socket.emit('response', { type: 'users:get', data: data });
  });

  socket.on('message:send', function (message) {
    message.time = new Date().getTime();
    console.log('response_message:send: ', message);
    socket.broadcast.emit('users:get', message);
  });

  socket.on('disconnect', function() {
    console.log("Socket disconnected: ", socket);

  });

  
});

console.log('server started at '+ port)
