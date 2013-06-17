$(document).ready(function () {

  // confirmations
  $('.confirm').submit(function (e) {
    e.preventDefault();
    var self = this;
    var msg = 'Are you sure?';
    bootbox.confirm(msg, 'cancel', 'Yes! I am sure', function (action) {
      if (action) {
        $(self).unbind('submit');
        $(self).trigger('submit');
      }
    });
  });

  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });

/*
  $('form').jsonForm({
    schema: {
      name: {
        type: 'string',
        title: 'Name',
        required: true
      },
      age: {
        type: 'number',
        title: 'Age'
      }
    },
    onSubmit: function (errors, values) {
      if (errors) {
        $('#res').html('<p>I beg your pardon?</p>');
      }
      else {
        $('#res').html('<p>Hello ' + values.name + '.' +
          (values.age ? '<br/>You are ' + values.age + '.' : '') +
          '</p>');
      }
    }
  });
*/
});