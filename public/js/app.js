$(document).ready(function () {
  var danger = false;

  $('.btn[type="submit"]').click(function () {
    danger = false;
  });

  $('.btn-danger[type="submit"]').click(function () {
    danger = true;
  });


  //confirmations
  $('.confirm').submit(function (e) {
    if(danger) {
      e.preventDefault();
      var self = this;

      if (!$('#myModal').length)
        $( "body" ).append('<div class="modal fade" id="myModal"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">Are you sure ?</h4></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-danger confirm-delete">Delete</button></div></div></div></div>');
      
      $('#myModal').modal('show')

      $('.confirm-delete').click(function(action) {
          $('#myModal').modal('hide');
          $(self).unbind('submit');
          event.action = 'delete'
          $(self).trigger('submit');
      })
    }
  });

  $('.alphanumeric').bind("keypress", function (event) {
    if (event.charCode!=0) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    }
  });  

  $('#tags').tagsInput({});

});