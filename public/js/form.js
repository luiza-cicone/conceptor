$(document).ready(function () {
  var socket = io.connect('http://localhost:1234');

  var path = window.location.pathname.split('/');

  socket.emit('request technique', {_id: path[path.length - 3], type : path[path.length - 1 ]});

  socket.on('form data', function (data) {


    // get attributes from others object into the technique object itself
    if(data.technique) {
      var newData = data.technique
      for (key in data.technique.others)
        newData[key] = data.technique.others[key]
      data.form.value = newData;
    }
    $('form').jsonForm(data.form);


    $('#tags').tagsInput();

  });
});
