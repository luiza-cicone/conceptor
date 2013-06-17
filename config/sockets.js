var socketio = require('socket.io')

var techniques = require('../app/controllers/techniques')
var phases = require('../app/controllers/phases')

module.exports.listen = function(server){

  io = socketio.listen(server)
  var perPage = 15, page = 0;
  var options = {
    perPage: perPage,
    page: page
  }
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