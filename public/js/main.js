// //The variable 'app' holds the client-side application.
window.app = {}


// //The function in charge of drawing the interactive graph'.
window.app.RenderGraph = function (nodes, links) {

    var width = $("#canvas").width()*.99;

    var chart = d3.timeline()
          .width(width)
          .stack()
          .hover(function (d, i, datum) { 
          // d is the current rendering object
          // i is the index during d3 rendering
          // datum is the id object
          if (!$('.tooltip').is(':visible'))
            $('#id' + d._id).tooltip('show')
          })
          .click(function (d, i, datum) {
            window.open('/phases/' + datum._id + '/' + d._id, '_self');
          })
          .scroll(function (x, scale) {
          });

    var svg = d3.select("#canvas")
        .append("svg")
        .attr("width", width)
        .datum({nodes : nodes, links : links})
        .call(chart);


    svg.append("svg:defs").append("svg:marker")
        .attr("id", "marker")
        .attr("viewBox", "0 0 4 4")
        .attr("refX", 2)
        .attr("refY", 2)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .attr("stroke", "#CCC")
        .attr("stroke-width", 1)
        .attr("fill", "#CCC")

        .append("svg:circle")
          .attr("cx", "2")
          .attr("cy", "2")
          .attr("r", "2")

        // svg.append("svg:defs").append("svg:marker")
        // .attr("id", "marker")
        // .attr("viewBox", "0 -5 10 10")
        // .attr("refX", 10)
        // .attr("refY", 0)
        // .attr("markerWidth", 6)
        // .attr("markerHeight", 6)
        // .attr("orient", "auto")
        // .append("svg:path")
        //   .attr("d", "M0,-5L10,0L0,5");

function updateWindow(){
    var width = $("#canvas").width()*.99;
    svg.attr("width", width);

    // TODO : update the X axys
}

window.onresize = updateWindow;

}
// var resizeTimer;

// $(window).resize(function () { 
//       clearTimeout(resizeTimer);
//       resizeTimer = setTimeout(doSomething, 100);
// });

// function doSomething() {
//     console.log("I'm done resizing for the moment");
    
//     var width = $("#canvas").width() *.9;
//     d3.select("svg").attr("width", width())
// };

// The the HTML document's DOM tree is ready
$(document).ready(function() {
    
  var socket = io.connect('http://localhost:1234');

  var path = window.location.pathname.split('/');
  socket.emit('request graph', {id : path[path.length - 2 ]});

  socket.on('graph data', function (data) {
    // var links = transformDataForD3(data);
    
    window.app.RenderGraph(data.nodes, data.links);
  });
});