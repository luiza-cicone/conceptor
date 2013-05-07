// //The variable 'app' holds the client-side application.
window.app = {}


// //The function in charge of drawing the interactive graph'.
window.app.RenderGraph = function (nodes, links) {
    var width = 1100,
        height = 500;

    // var data = {
    //     nodes : [
    //         {name : "Analyse Qualitative", posx : 110, posy : 200},
    //         {name : "Analyse Quantitative", posx : 260, posy : 200},
    //         {name : "Use cases", posx : 410, posy : 200},
    //         {name : "Sketch mobile", posx : 560, posy : 200},
    //         {name : "Sketch tablette", posx : 560, posy : 250},
    //         {name : "Guerilla testing", posx : 710, posy : 200},
    //         {name : "Unit testing", posx : 850, posy : 200}
    //     ],
    //     links : [
    //       {source: 0, target: 1},
    //       {source: 1, target: 2},
    //       {source: 2, target: 3},
    //       {source: 2, target: 4},
    //       {source: 3, target: 5},
    //       {source: 4, target: 5},
    //       {source: 5, target: 6}
    //     ]
    // };

    for (var i = 0; i <= nodes.length - 1; i++) {
        nodes[i].posx = 960-i*150;
        nodes[i].posy = 200;
    };

    var force = d3.layout.force()
        .nodes(nodes)
        .links(data.links)
        .size([width, height])
        .linkDistance(100)
        .charge(-300)
        .on("tick", tick)
        .start();
    
    var svg = d3.select("#canvas").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link")
        .data(force.links())
      .enter().append("line")
        .attr("class", "link");

    var node = svg.selectAll(".node")
        .data(force.nodes())
      .enter().append("g")
        .attr("class", "node")
        // .call(force.drag)
        // .on("mousedown", function(d) {
        //     d.fixed = true;
        //     d3.select(this).classed("sticky", true);
        // })

    node.append("rect")
        .attr("x", -50)
        .attr("y", -10)
        .attr("width", 110)
        .attr("height", 20)
        .attr("rx", 5)
        .attr("ry", 5);

    node.append("text")
        .attr("x", 0)
        .attr("dy", ".35em")
        .style("text-anchor", function(d) { return "middle"; })
        .text(function(d) { return d.title; });

    function tick() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("transform", function(d) {
            d.fixed = true;  d.px = d.posx; d.py = d.posy; 
            return "translate(" + d.x + "," + d.y + ")" 
          })
    }
    
    // function mouseover() {
    //   d3.select(this).select("circle").transition()
    //       .duration(750)
    //       .attr("r", 16);
    // }

    // function mouseout() {
    //   d3.select(this).select("circle").transition()
    //       .duration(750)
    //       .attr("r", 8);
    // }

//     var w = 960,
//     h = 500,
//     r = 6,
//     fill = d3.scale.category20();

// var force = d3.layout.force()
//     .charge(-120)
//     .linkDistance(30)
//     .size([w, h]);

// var svg = d3.select("#canvas").append("svg")
//     .attr("width", w)
//     .attr("height", h);

// d3.json("/js/graph.json", function(json) {
//   var link = svg.selectAll("line")
//       .data(json.links)
//     .enter().append("svg:line");

//   var node = svg.selectAll("circle")
//       .data(json.nodes)
//     .enter().append("svg:circle")
//       .attr("r", r - .75)
//       .style("fill", function(d) { return fill(d.group); })
//       .style("stroke", function(d) { return d3.rgb(fill(d.group)).darker(); })
//       .call(force.drag);

//   force
//       .nodes(json.nodes)
//       .links(json.links)
//       .on("tick", tick)
//       .start();

//   function tick(d) {

//     // Push sources up and targets down to form a weak tree.
//     var k = 6 * e.alpha;
//     json.links.forEach(function(d, i) {
//       d.source.y -= k;
//       d.target.y += k;
//     });

//     node.attr("cx", function(d) { return d.x; })
//         .attr("cy", function(d) { return d.y; });

//     link.attr("x1", function(d) { return d.source.x; })
//         .attr("y1", function(d) { return d.source.y; })
//         .attr("x2", function(d) { return d.target.x; })
//         .attr("y2", function(d) { return d.target.y; });
//   }
// });



    // var width = 960,
    //     height = 500;

    // var cluster = d3.layout.cluster()
    //     .size([height, width - 160]);

    // var diagonal = d3.svg.diagonal()
    //     .projection(function(d) { return [d.y, d.x]; });

    // var svg = d3.select("#canvas").append("svg")
    //     .attr("width", width)
    //     .attr("height", height)
    //   .append("g")
    //     .attr("transform", "translate(40,0)");

    // d3.json("/flare.json", function(root) {
    //   var nodes = cluster.nodes(root),
    //       links = cluster.links(nodes);

    //   var link = svg.selectAll(".link")
    //       .data(links)
    //     .enter().append("path")
    //       .attr("class", "link")
    //       .attr("d", diagonal);

    //   var node = svg.selectAll(".node")
    //       .data(nodes)
    //     .enter().append("g")
    //       .attr("class", "node")
    //       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    //   node.append("rect")
    //       .attr("width", 120)
    //       .attr("height", 15)
    //       .attr("x", -10)
    //       .attr("y", -7.5)


    //   node.append("text")
    //       .attr("dx", 53)
    //       .attr("dy", 3)
    //       .style("text-anchor", function(d) { return "middle"; })
    //       .text(function(d) { return d.name; });
    // });

    // d3.select(self.frameElement).style("height", height + "px");
}


// The the HTML document's DOM tree is ready, I'm invoking all the code that need access to the HTML document 's DOM elements:
   // For that I'm using the jQuery shorcut.
$(document).ready(function() {

  var socket = io.connect('http://localhost:1234');
  socket.on('techniques', function (data) {
    window.app.RenderGraph(data.nodes, data.links);
  });

});