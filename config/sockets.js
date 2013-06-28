var socketio = require('socket.io')

var phases = require('../app/controllers/phases')
var forms = require('../app/controllers/forms')

module.exports.listen = function(server){

  io = socketio.listen(server)

  io.sockets.on('connection', function(socket){

    socket.on('request technique', function (technique) {
      forms.json(technique.type, function(form) {
        socket.emit('form data', form);
      })  
    });
    socket.on('request graph', function () {
      phases.json(function(techniquesJson, linksJson) {
        socket.emit('graph data', {nodes : techniquesJson, links : linksJson});
      }) 
    });

  	socket.on('do close', function (data) {
    	socket.disconnect();
  	});
  })

  return io

}

