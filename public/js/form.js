$(document).ready(function () {
  var socket = io.connect('http://localhost:1234');

  var path = window.location.pathname.split('/');

  socket.emit('request technique', {type : path[path.length - 1 ]});

  socket.on('form data', function (data) {
    socket.emit('do close', { return: 0 });

    console.log(data)

    $('form').jsonForm(data);

    $('#tags').tagsInput();
  });
});