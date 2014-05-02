/*
 * d3 component, using the chartComponent
 */

var D3CalendarViewComponent = D3ComponentBase.extend({

  defaultWidth: 600,
  defaultHeight: 136,
  cellSize: 17,
  _formattingFunction: function(d, v) {
    return d + ": " + v;
  },

  render: function(data) {

  /*
   * Changes made to the original sample:
   * 
   * 1. Width and Height to this.getWidth(), this.getHeight()
   * 2. d3.select("body") to "#"+this.htmlObject
   * 
   * 
   * Arguments:
   * 
   * 
   */


   /*
    * [PA] We'll get the min and max year from the query. We only support yyyy-mm-dd
    */

    var minYear = d3.min(data.resultset,function(d){return d[0].substring(0,4)});
    var maxYear = d3.max(data.resultset,function(d){return d[0].substring(0,4)});
    var minValue = d3.min(data.resultset,function(d){return d[1]});
    var maxValue = d3.max(data.resultset,function(d){return d[1]});
    
    // Infer cellSize from width
    var cellSize = Math.floor( (this.getWidth()-59) / 53);
    
    var internalHeight= cellSize*7+17;
    
    
    
    var width = this.getWidth(),
            height = this.getHeight();

    var day = d3.time.format("%w"),
            week = d3.time.format("%U"),
            percent = d3.format(".1%"),
            format = d3.time.format("%Y-%m-%d");

    var color = d3.scale.quantize()
            .domain([minValue, maxValue])
            .range(d3.range(11).map(function(d) {
      return "q" + d + "-11";
    }));

    var svg = d3.select("#"+this.htmlObject).selectAll("svg")
            .data(d3.range(minYear, maxYear))
            .enter().append("svg")
            .attr("width", width)
            .attr("height", internalHeight)
            .attr("class", "RdYlGn")
            .append("g")
            .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (internalHeight - cellSize * 7 - 1) + ")");

    svg.append("text")
            .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
            .style("text-anchor", "middle")
            .text(function(d) {
      return d;
    });

    var rect = svg.selectAll(".day")
            .data(function(d) {
      return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
            .enter().append("rect")
            .attr("class", "day")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d) {
      return week(d) * cellSize;
    })
            .attr("y", function(d) {
      return day(d) * cellSize;
    })
            .datum(format);

    rect.append("title")
            .text(function(d) {
      return d;
    });

    svg.selectAll(".month")
            .data(function(d) {
      return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
            .enter().append("path")
            .attr("class", "month")
            .attr("d", monthPath);


    // [PA] Commenting out the csv call and using the data we have already
    // 
    
    /* d3.csv("http://127.0.0.1:8080/pentaho/api/repos/d3ComponentLibrary/static/custom/data/dji.csv", function(error, csv) {
     var data = d3.nest()
     .key(function(d) {
     return d.Date;
     })
     .rollup(function(d) {
     return (d[0].Close - d[0].Open) / d[0].Open;
     })
     .map(csv);
     // */
    var dataIndexed = [];
    data.resultset.map(function(d){
      dataIndexed[d[0]] = d[1];
    });

    var formattingFunction = this.cccTooltipFormat||this._formattingFunction;

    rect.filter(function(d) {
      return d in dataIndexed;
    })
            .attr("class", function(d) {
      return "day " + color(dataIndexed[d]);
    })
            .select("title")
            .text(function(d) {
      return formattingFunction(d,dataIndexed[d]);
    });
    
       //      });

    function monthPath(t0) {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
              d0 = +day(t0), w0 = +week(t0),
              d1 = +day(t1), w1 = +week(t1);
      return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
              + "H" + w0 * cellSize + "V" + 7 * cellSize
              + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
              + "H" + (w1 + 1) * cellSize + "V" + 0
              + "H" + (w0 + 1) * cellSize + "Z";
    }

    // d3.select(self.frameElement).style("height", height + "px");



  }
  
});


