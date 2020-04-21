const app = require('http').createServer(handler);
const io = require('socket.io')(app, {transports: ['polling']});
const fs = require('fs');
const active_matches = require('./controller/active_matches')
const match_serivce = require('./services/matchService')


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

  socket.on('users:getMove', function(data) {
    // console.log('response_users:get: ', data);
    socket.emit('response', { type: 'users:getMove', data: data });
  });

  socket.on('message:sendMove', function (message) {
    message.time = new Date().getTime()
    // console.log('response_message:send: ', message)
    active_matches.logMatchMove(message)
    re_add = active_matches.getRecipientAddress(message)
    io.to(re_add).emit('users:getMove', message);
    if(message.game_stats.over){
      // Add game to the database using service
        let matchId = message.matchId
        let result = 0
        if (message.game_stats.winner === 'w'){
            result = 1
        }else if (message.game_stats.winner === 'b'){
            result = -1
        }
        match = {"id": matchId, "result": result}
        match_serivce.updateMatch(matchId, match).then()
        // remove match from here
        active_matches.removeMatch(message)
    }
  });

  socket.on('disconnect', function() {
    // console.log("Socket disconnected: ", socket.id);
  });

  socket.on('init_match', function (match) {
      // console.log("INIT_MATCH")
      status = active_matches.addMatch(match, socket.id)
      // console.log(status)
    if (Object.keys(status).length == 2){
      // {'player_color':##, last_move={}}
      io.to(status[match.player]).emit('opponent_status', "offline");
    }else{
      io.to(status['b']).emit('opponent_status', "online");
      io.to(status['w']).emit('opponent_status', "online");
    }
    // restore match
     last_move = active_matches.getLastMove(match.matchId)
    if (Object.keys(last_move).length){
      // match started
      io.to(socket.id).emit('restore_match', last_move)
    }
    })

  socket.on('show_offline', function(match) {
      // console.log("offline: ", socket.id)
      status = active_matches.removePlayerFromMatch(match)
      // console.log("offline status: ", status)
      online_p_color = match.player === 'w' ? 'b' : 'w'
      io.to(status[online_p_color]).emit('opponent_status', "offline");
  })
  
  console.log("Socket Connected: ", socket.id)
});

console.log('server started at '+ port)
