
function lcm_rec(i, array) {
  var a=array[i];

  if (i == array.length - 2) {
    var b=array[i+1]
  } else {
    b = lcm_rec(i+1, array)
  }
  return a*b/gcd(a,b);
}

function lcm(array) {
  return lcm_rec(0, array);
}

function gcd(a, b) {
  if (b) {
      return gcd(b, a % b);
  } else {
      return Math.abs(a);
  }
}

(function() {
  
  d3.timeline = function() {

    function timeFormat(formats) {
      return function(date) {
        var i = formats.length - 1, f = formats[i];
        while (!f[1](date)) f = formats[--i];
        return f[0](date);
      };
    }

    var customTimeFormat = timeFormat([
      [d3.time.format("%Y"), function() { return true; }],
      [d3.time.format("%b"), function(d) { return d.getMonth(); }],
      [d3.time.format("%d %b"), function(d) { return d.getDate() != 1; }],
      [d3.time.format("%a %d"), function(d) { return d.getDay() != 1 && d.getDate() != 1; }],
      [d3.time.format("%Hh"), function(d) { return d.getHours(); }],
      [d3.time.format("%Hh%M"), function(d) { return d.getMinutes(); }],
      [d3.time.format("'%M"), function(d) { return d.getMinutes() % 10 != 0; }],
      [d3.time.format("''%S"), function(d) { return d.getSeconds(); }],
      [d3.time.format(".%L"), function(d) { return d.getMilliseconds(); }]
    ]);

    var hover = function () {},
        mouseover = function () {},
        mouseout = function () {},
        click = function () {},
        scroll = function () {},
        orient = "bottom",
        width = null,
        height = null,
        tickFormat = { format: customTimeFormat, 
          tickTime: d3.time.days, 
          tickNumber: 1},
        colorCycle = d3.scale.category10(),
        display = "rect",
        beginning = 0,
        ending = 0,
        margin = {left: 0, right: 0, top: -60, bottom: 0},
        stacked = false,
        rotateTicks = false,
        itemHeight = 80,
        itemMargin = {top: 20, bottom: 10}
      ;

    function timeline (gParent) {
      var g = gParent.append("g");
      var gParentSize = {top:0, width:0};

      var gParentItem = d3.select(gParent[0][0]);

      var yAxisMapping = {},
        maxStack = 1,
        minTime = 0,
        maxTime = 0;
      
      setWidth();

      // check how many stacks we're gonna need
      // do this here so that we can draw the axis before the graph
      if (stacked || (ending == 0 && beginning == 0)) {
        g.each(function (d, i) {
          d.nodes.forEach(function (datum, index) {

            // create y mapping for stacked graph
            if (stacked && Object.keys(yAxisMapping).indexOf(index) == -1) {
              yAxisMapping[index] = maxStack;
              maxStack++;
            }

            // figure out beginning and ending times if they are unspecified
            if (ending == 0 && beginning == 0){
              datum.techniques.forEach(function (time, i) {
                if (new Date(time.createdAt).getTime() < minTime || minTime == 0)
                  minTime = new Date(time.createdAt).getTime();
                if (new Date(time.finishedAt).getTime() > maxTime)
                  maxTime = new Date(time.finishedAt).getTime();
              });
            }
          });
        });

        if (ending == 0 && beginning == 0) {
          beginning = minTime - (maxTime - minTime)*.1;
          ending = maxTime + (maxTime - minTime)*.1;
        }
      }

      var scaleFactor = (1/(ending - beginning)) * width;

      // draw the axis
      var xScale = d3.time.scale()
        .domain([beginning, ending])
        .range([0, width]);

      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient(orient)
        .tickFormat(tickFormat.format)
        .ticks(15)
        ;

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 +","+(margin.top + (itemHeight + itemMargin.top + itemMargin.bottom) * maxStack)+")")
        .call(xAxis);

      // draw the chart
      var elements = g.append("g")
        .attr("class", "nodes");
      
      var staticElem = g.append("g")
        .attr("class", "static");

      elements.each(function(d, i) {
          d.nodes.forEach( function(datum, index){
            var data = datum.techniques;

            var voisins = [];
            var finished = [];

            data.forEach(function(activity, activityIndex) {

              var createdAt = new Date(activity.createdAt).getTime()
              var finishedAt = new Date(activity.finishedAt).getTime()

              voisins.splice(activityIndex, 0, 1);
              finished.push({no : activityIndex, finishedAt : finishedAt})

              for (var j = 0; j < finished.length ; j++) {
                if (createdAt > finished[j].finishedAt) {
                  finished.splice(j, 1)
                }
              };
              var no = Math.max (finished.length, voisins[activityIndex]);
              voisins.splice(activityIndex, 1, no)
              for (var j = 0; j < finished.length ; j++) {
                voisins.splice(finished[j].no, 1, no)
              }
            });

            var length = lcm(voisins);

            var positionArray = [];
            var indexArray = [];

            for(var i = 0; i < length; i++) {
              positionArray.push(0);
            }

            data.forEach(function(activity, activityIndex) {
              var createdAt = new Date(activity.createdAt).getTime()
              var finishedAt = new Date(activity.finishedAt).getTime()

              var increment = length/voisins[activityIndex];

              for (j = 0; j < length; j = j+increment) {
                var free = true;

                for (k = j ; k < j + increment; k++) {
                  if (createdAt < positionArray[k]) {
                    free = false;
                  };
                }
                if (free == true) {
                  indexArray.splice(activityIndex, 1, j);
                  for (k = j; k < j + increment; k++) {
                    positionArray[k] = finishedAt;
                  };
                  break;
                }
              }
            });

            var rect = elements.selectAll("svg").data(data).enter().append(display);
            rect
              .attr('x', getXPos)
              .attr("y", getStackPosition)
              .attr("width", getElementWidth)
              .attr("height", getElementHeight)
              .attr("class", getId)
              .style("fill", colorCycle(index))
              .on("mousemove", function (d, i) {
                hover(d, index, datum);
              })
              .on("mouseover", function (d, i) {
                mouseover(d, i, datum);
              })
              .on("mouseout", function (d, i) {
                mouseout(d, i, datum);
              })
              .on("click", function (d, i) {
                click(d, index, datum);
              })
            ;

          // add the label
          var hasLabel = (typeof(datum.title) != "undefined");
          if (hasLabel) {
            staticElem.append('text')
              .attr("class", "timeline-label")
              .attr("transform", "translate("+ 5 +","+ (margin.top + (itemHeight + itemMargin.top + itemMargin.bottom) * yAxisMapping[index] - 6) +")")
              .text(hasLabel ? datum.title : datum.id);
          }

/*
          // add icon
          if (typeof(datum.icon) != "undefined") {
            staticElem.append('image')
              .attr("class", "timeline-label")
              .attr("transform", "translate("+ 0 +","+ (margin.top + (itemHeight + (itemMargin.top + itemMargin.bottom)) * yAxisMapping[index])+")")
              .attr("xlink:href", datum.icon)
              .attr("width", margin.left)
              .attr("height", itemHeight);
          }
*/
          function getStackPosition(d, i) {

            if (stacked) {
              return (margin.top + (itemHeight + itemMargin.top + itemMargin.bottom) * yAxisMapping[index]) + itemHeight / length * indexArray[i];
            } 
            return margin.top;
          }

          function getElementHeight(d, i) { 
            return itemHeight / voisins[i] - 2;
          }

          function getElementWidth(d, i) {
            var width =  (new Date(d.finishedAt).getTime() - new Date(d.createdAt).getTime()) * scaleFactor;
            
            //make the activity 1% shorter to max 30min 
            width-= Math.min(1800000, .1*width);
            return width;
          }

        });
      });
      

      var lines = g.insert("g", ".nodes")
        .attr("class", "lines");
      
      
      function updateLinks() {

        var newLinks = [];

        g.each(function (d, i) {
          d.links.forEach(function(datum, index){
            
            var sourceRect = elements.selectAll(".id" + datum.source);
            var targetRect = elements.selectAll(".id" + datum.target);

            var components = d3.transform(elements.attr("transform"));

            var x1 = ((1*sourceRect.attr("x")) + (sourceRect.attr("width") * 1)) * components.scale[0] + components.translate[0];
            var y1 = 1*sourceRect.attr("y") + 1*sourceRect.attr("height")/2;
            var x2 = (1*targetRect.attr("x") )* components.scale[0] + components.translate[0];
            var y2 = 1*targetRect.attr("y") + 1*targetRect.attr("height")/2;


            newLinks.push({
                source : {x: x1, y: y1}, 
                target : {x: x2, y: y2}
              });
          });
        });

        return newLinks
      }

      function updateLinksPosition() {
        newLinks = updateLinks();

        lines.selectAll("path.link")
            .data(newLinks)
            .attr("d", drawLine)
        ;
      }

      var newLinks = updateLinks();

      function drawLine(d) {
        var x1 = d.source.x;
        var y1 = d.source.y;
        var x2 = d.target.x;
        var y2 = d.target.y;

        var dx = .8*(x2-x1)/2
        var dy = Math.min(dx, 2 * itemHeight);
        return "M" + x1 + "," + y1 + "C" + (x1+dx) + "," + (y1+dy) + " " + (x2-dx) + "," + (y2-dy)+ " " + + x2 + "," + y2;
      }

      lines.selectAll("path")
            .data(newLinks)
            .enter().append("path")
            .attr("d",  drawLine)
            .attr("class", "link")
            .attr("stroke-width", 1)
            .attr("stroke", "#333")
            .attr("fill", "none")
            .attr("marker-start", "url(#Marker)")
            .attr("marker-end", "url(#Marker)")

      var zoomVar = d3.behavior.zoom()
        .x(xScale)
        // .scaleExtent([.02, 30])
        .on("zoom", zoom);

      function zoom() {
        elements.attr("transform", "translate(" + d3.event.translate[0] + ", 0) scale(" + d3.event.scale + ", 1)");
        g.select(".x.axis").call(xAxis);
        updateLinksPosition();
      }

      gParent
          .attr("class", "scrollable")
          .call(zoomVar);
      
      if (rotateTicks) {
        g.selectAll("text")
          .attr("transform", function(d) {
            return "rotate(" + rotateTicks + ")translate("
              + (this.getBBox().width/2+10) + "," // TODO: change this 10
              + this.getBBox().height/2 + ")";
          });
      }

      var gSize = g[0][0].getBoundingClientRect();
      setHeight();

      function getXPos(d, i) {
        return (new Date(d.createdAt).getTime() - beginning) * scaleFactor;
      }

      function getId(d, i) {
        return "id" + d._id;
      }

      function setHeight() {
        if (!height && !gParentItem.attr("height")) {
          if (itemHeight) {
            // set height based off of item height
            height = gSize.height + gSize.top - gParentSize.top;
            // set bounding rectangle height
            d3.select(gParent[0][0]).attr("height", height);
          } else {
            throw "height of the timeline is not set";
          }
        } else {
          if (!height) {
            height = gParentItem.attr("height");
          } else {
            gParentItem.attr("height", height);
          }
        }
      }

      function setWidth() {
        if (!width && !gParentSize.width) {
          throw "width of the timeline is not set";
        } else if (!(width && gParentSize.width)) {
          if (!width) {
            width = gParentItem.attr("width");
          } else {
            gParentItem.attr("width", window.getComputedStyle(gParent[0][0])["width"]);
            gParentSize.width = (window.getComputedStyle(gParent[0][0])["width"].replace(/px/g, ""))*1;
          }
        }
        // if both are set, do nothing
      }
    }

    timeline.margin = function (p) {
      if (!arguments.length) return margin;
      margin = p;
      return timeline;
    }

    timeline.orient = function (orientation) {
      if (!arguments.length) return orient;
      orient = orientation;
      return timeline;
    };
    
    timeline.itemHeight = function (h) {
      if (!arguments.length) return itemHeight;
      itemHeight = h;
      return timeline;
    }

    timeline.itemMargin = function (h) {
      if (!arguments.length) return itemMargin;
      itemMargin.top = h/2;
      itemMargin.bottom = h/2;
      return timeline;
    }

    timeline.height = function (h) {
      if (!arguments.length) return height;
      height = h;
      return timeline;
    };

    timeline.width = function (w) {
      if (!arguments.length) return width;
      width = w;
      return timeline;
    };

    timeline.tickFormat = function (format) {
      if (!arguments.length) return tickFormat;
      tickFormat = format;
      return timeline;
    };

    timeline.hover = function (hoverFunc) {
      if (!arguments.length) return hover;
      hover = hoverFunc;
      return timeline;
    };

    timeline.mouseover = function (mouseoverFunc) {
      if (!arguments.length) return mouseoverFunc;
      mouseover = mouseoverFunc;
      return timeline;
    };

    timeline.mouseout = function (mouseoverFunc) {
      if (!arguments.length) return mouseoverFunc;
      mouseout = mouseoverFunc;
      return timeline;
    };

    timeline.click = function (clickFunc) {
      if (!arguments.length) return click;
      click = clickFunc;
      return timeline;
    };
    
    timeline.scroll = function (scrollFunc) {
      if (!arguments.length) return scroll;
      scroll = scrollFunc;
      return timeline;
    }

    timeline.colors = function (colorFormat) {
      if (!arguments.length) return colorCycle;
      colorCycle = colorFormat;
      return timeline;
    };

    timeline.beginning = function (b) {
      if (!arguments.length) return beginning;
      beginning = b;
      return timeline;
    };

    timeline.ending = function (e) {
      if (!arguments.length) return ending;
      ending = e;
      return timeline;
    };

    timeline.rotateTicks = function (degrees) {
      rotateTicks = degrees;
      return timeline;
    }

    timeline.stack = function () {
      stacked = !stacked;
      return timeline;
    };
    
    return timeline;
  };
})();
