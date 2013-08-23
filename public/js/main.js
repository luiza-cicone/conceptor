// //The variable 'app' holds the client-side application.
window.app = {}



// //The function in charge of drawing the interactive graph'.
window.app.RenderGraph = function (process, nodes, links) {

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
          window.open('/processes/' + process+ '/' + datum._id + '/' + d._id, '_self');
        })
        .scroll(function (x, scale) {
        });

  var svg = d3.select("#canvas")
      .append("svg")
      .attr("width", width)
      .datum({nodes : nodes, links : links})
      .call(chart)
      .on("click", click)

function click() 
{
    console.log("lala"); //considering dot has a title attribute
}

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

}

  function update(nodes, links){
    console.log("TODO : must update");
  }

// The the HTML document's DOM tree is ready
$(document).ready(function() {
  var path = window.location.pathname.split('/');

  var socket = io.connect('http://'+path[0]+':1234');

  socket.emit('request graph', {id : path[path.length - 2 ]});

  socket.on('graph data', function (data) {
    // if (i == 0) {
      window.app.RenderGraph(path[path.length - 2], data.nodes, data.links);
    // }
    // else
      // update(data.nodes, data.links)
    // i++;
  });
});