// //The variable 'app' holds the client-side application.
window.app = {}


// //The function in charge of drawing the interactive graph'.
window.app.RenderGraph = function (nodes, links) {

    var chart = d3.timeline();

    var width = 940;

    var chart = d3.timeline()
          .width(width)
          .stack()
          .hover(function (d, i, datum) { 
          // d is the current rendering object
          // i is the index during d3 rendering
          // datum is the id object
          })
          .click(function (d, i, datum) {
            window.open('/phases/' + datum._id + '/' + d._id, '_self');
          })
          .scroll(function (x, scale) {
          });

    var svg = d3.select("#canvas")
        .append("svg")
        .datum({nodes : nodes, links : links})
        .attr("width", width)
        .call(chart);

}


// The the HTML document's DOM tree is ready, I'm invoking all the code that need access to the HTML document 's DOM elements:
   // For that I'm using the jQuery shorcut.
$(document).ready(function() {
    
  var socket = io.connect('http://localhost:1234');
  socket.emit('request graph', {});
  socket.on('graph data', function (data) {
    // var links = transformDataForD3(data);
    socket.emit('do close', { return: 0 });
    window.app.RenderGraph(data.nodes, data.links);
  });

});