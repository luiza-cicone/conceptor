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
      var msg = 'Are you sure?';
      bootbox.confirm(msg, 'cancel', 'Yes! I am sure', function (action) {
        if (action) {
          $(self).unbind('submit');
          event.action = 'delete'
          $(self).trigger('submit');

        }
      });
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

});