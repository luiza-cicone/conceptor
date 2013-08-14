var socketio = require('socket.io')

var processes = require('../app/controllers/processes')
var forms = require('../app/controllers/forms')
var techniques = require('../app/controllers/techniques')

module.exports.listen = function(server){

  io = socketio.listen(server)

  io.sockets.on('connection', function(socket){

    socket.on('request technique', function (technique) {

      console.log(technique)

      forms.json(technique.type, function(form) {

        techniques.getOne(technique._id, function(technique){
          socket.emit('form data', {form: form, technique:technique});
        })

      })  
    });

    socket.on('request graph', function (process) {
      setInterval(function() {
        processes.json(process.id, function(techniquesJson, linksJson) {
          socket.emit('graph data', {nodes : techniquesJson, links : linksJson});
        }) 
      }, 1000);
    });

    socket.on('request process graph', function (process) {
      processes.schema(process.id, function(phases, links) {
        socket.emit('process graph data', {nodes : phases, links : links});
      }) 
    });

  })

  return io

}

