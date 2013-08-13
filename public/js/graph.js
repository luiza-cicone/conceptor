// The variable 'app' holds the client-side application.
window.app = {}


// The function in charge of drawing the interactive graph'.
window.app.RenderGraph = function (nodes, links) {


    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
      for (var i =  0; i < nodes.length ; i++) {
        if(nodes[i]._id == link.source) 
          link.source = i;
      
        if(nodes[i]._id == link.target) 
          link.target = i;
      };
      link.type = "arrow"
    });

    var w = 350,
        h = 250;

    var r = 30;

    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([w, h])
        .linkDistance(120)
        .friction(.3)
        .gravity(.3)
        .charge(-3000)
        .on("tick", tick)
        .start();

    var svg = d3.select("#graph").append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    // Per-type markers, as they don't inherit styles.
    svg.append("svg:defs").selectAll("marker")
      .data(["arrow"])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", r + 15)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");

    var path = svg.append("svg:g").selectAll("path")
      .data(force.links())
      .enter().append("svg:path")
        .attr("class", "link")
        .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

      var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("svg:g")
          .attr("class", "node")
          .call(force.drag)
          .on("mousedown", function(d) { d.fixed = true; })


      // add the nodes
      var circle = node.append("svg:circle")
          .attr("class", "node-circle")
          .attr("r", r);

    // A copy of the text with a thick white stroke for legibility.
    // node.append("svg:text")
    //     .attr("x", .5)
    //     .attr("y", ".31em")
    //     .attr("text-anchor", "middle")
    //     .attr("class", "shadow")
    //     .text(function(d) { return d.name; });

      // add the text
      var text = node.append("svg:text")
          .attr("x", 0)
          .attr("y", ".31em")
          .attr("class", "node-text")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.name; });

    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
      path.attr("d", function(d) {
        // var dx = d.target.x - d.source.x,
        //     dy = d.target.y - d.source.y,
        //     dr = Math.sqrt(dx * dx + dy * dy);
        // return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        return "M" + d.source.x + "," + d.source.y + "L"  + d.target.x + "," + d.target.y;
      });

      node.attr("transform", function(d) {
        d.x = Math.max(r, Math.min(w - r, d.x));
        d.y = Math.max(r, Math.min(h - r, d.y));

        return "translate(" + d.x + "," + d.y + ")";
      });
    }

    // Do something on hover on those span tags
    // $('text').hover(function(){
    //   // Do whatever you want here
    //   $(this).siblings().trigger("mouseenter");
    // },function(){
    //   // And here
    //   $(this).siblings().trigger("mouseout");
    // });
}

$(document).ready(function() {
    
  var socket = io.connect('http://localhost:1234');

  socket.emit('request process graph', {id : "51dc1113ff3ba72edc000001"});

  socket.on('process graph data', function (data) {

    window.app.RenderGraph(data.nodes, data.links);
  });
});