var socketio = require('socket.io')
	, mongoose = require('mongoose')
  , Technique = mongoose.model('Technique')

var techniques = require('../app/controllers/techniques')

module.exports.listen = function(server){

  io = socketio.listen(server)
  var perPage = 15, page = 0;
  var options = {
    perPage: perPage,
    page: page
  }
  io.sockets.on('connection', function(socket){
    techniques.json(function(techniquesJson, linksJson) {
      socket.emit('techniques', {nodes : techniquesJson, links : linksJson});
    })

  	// Technique.list(options, function(err, techniques) {
   //  	if (err) return res.render('500', {error : err})
	  //   socket.emit('techniques', techniques);
  	// })  	

  	// socket.on('my other event', function (data) {
   //  	console.log(data);
  	// });
  })

  return io

}