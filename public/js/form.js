$(document).ready(function () {
  var socket = io.connect('http://localhost:1234');

  var path = window.location.pathname.split('/');

  socket.emit('request technique', {_id: path[path.length - 3], type : path[path.length - 2]});
  var part = path[path.length - 1];
  socket.on('form data', function (data) {

    console.log(data);

    // get attributes from others object into the technique object itself

    if (part == '1') {
      $('form').jsonForm(data.form.json);
    }
    if (part == '2' || part == 'edit') {


    jQuery.fn.anim_progressbar = function (aOptions) {
        // def values
        var iCms = 1000;
        var iMms = 60 * iCms;
        var iHms = 3600 * iCms;
        var iDms = 24 * 3600 * iCms;

        // def options
        var aDefOpts = {
            start: new Date(), // now
            finish: new Date().setTime(new Date().getTime() + 15 * iMms), // now + 14min
            interval: 100
        }
        var aOpts = jQuery.extend(aDefOpts, aOptions);
        var vPb = this;

        // each progress bar
        return this.each(
            function() {
                var iDuration = aOpts.finish - aOpts.start;

                // calling original progressbar
                $(vPb).children('.pbar').progressbar({value:iDuration/1000, max:iDuration}).height(7);

                // looping process
                var vInterval = setInterval(
                    function(){
                        var iLeftMs = aOpts.finish - new Date(); // left time in MS
                        var iElapsedMs = new Date() - aOpts.start, // elapsed time in MS
                            iDays = parseInt(iElapsedMs / iDms), // elapsed days
                            iHours = parseInt((iElapsedMs - (iDays * iDms)) / iHms), // elapsed hours
                            iMin = parseInt((iElapsedMs - (iDays * iDms) - (iHours * iHms)) / iMms), // elapsed minutes
                            iSec = parseInt((iElapsedMs - (iDays * iDms) - (iMin * iMms) - (iHours * iHms)) / iCms), // elapsed seconds
                            iPerc = (iElapsedMs > 0) ? iElapsedMs / iDuration * 100 : 0; // percentages

                        // display current positions and progress
                        $(vPb).children('.pbar').children('.progress-label').html(iPerc.toFixed(1) + '%');

                        var sMmsText = iMin+'m:'+iSec+'s',
                            sHmsText = iHours+'h:'+ sMmsText,
                            sDmsText = iDays+' days '+ sHmsText,
                            sElapsed = sMmsText;

                        if (iDays != 0)
                            sElapsed = sDmsText
                        else if(iHours != 0 )
                            sElapsed = sHmsText
                        
                        $(vPb).children('.elapsed').html('<b>' +sElapsed+'</b>');

                        $(vPb).children('.pbar').children('.ui-progressbar-value').css('width', iPerc+'%')

                        // in case of Finish
                        if (iPerc >= 100) {
                            // clearInterval(vInterval);
                            $(vPb).children('.pbar').children('.progress-label').html('Estimated time elapsed');
                            $(vPb).children('.pbar').progressbar({value:false});
                        }
                    } ,aOpts.interval
                );
            }
        );
    }

    // default mode
    $('#progress').anim_progressbar();

    // from second #5 till 15
    var iNow = new Date().setTime(new Date().getTime() + 5 * 1000); // now plus 5 secs
    var iEnd = new Date().setTime(new Date().getTime() + 15 * 1000); // now plus 15 secs
   

      if(data.technique) {
      var newData = data.technique
      for (key in data.technique.others)
        newData[key] = data.technique.others[key]
      data.form.json_second.value = newData;
    }
      $('form').jsonForm(data.form.json_second);
    }

    $('#tags').tagsInput();

  });
});
