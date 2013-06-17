var socketio = require('socket.io')

var techniques = require('../app/controllers/techniques')
var phases = require('../app/controllers/phases')

module.exports.listen = function(server){

  io = socketio.listen(server)

  io.sockets.on('connection', function(socket){
    phases.json(function(techniquesJson, linksJson) {
      socket.emit('graph data', {nodes : techniquesJson, links : linksJson});
    }) 	

  	socket.on('do close', function (data) {
    	socket.disconnect();
  	});
  })

  return io

}