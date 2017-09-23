define([
  '../commons/lib/d3'
], function(
  d3 
) {
  // MotionScatterPlot  
  return function (dataObject,options) {
	
  	if (typeof options != "object") 
  		throw TypeError;
	
	
  	var chartSel = options.chartSel || "#chart";
  	var mot = d3.select(chartSel);
  	var _n,bisect,dot,box,overlay,
  	label,svg,xAxis,yAxis,xScale,yScale,radiusScale,colorScale;
  	var yMax = 0;
  	var yMin = 9999999;
  	var width = options.width || 640;
  	var height = options.height || 480;
  	var margin = options.margin || {
              top: 19.5,
              right: 19.5,
              bottom: 19.5,
              left: 39.5
          };
      var transDuration = options.transDuration || 30000;
      var chartTitle = options.chartTitle || "";
      var yAxisText = options.yAxisText || "";

  	_setSize([width,height]);
	
  	function _setData(d){
  		dataObject = d;
  	}

      // Various accessors that specify the four dimensions of data to visualize.
      function x(d) {
          return d.income;
      }

      function y(d) {
          return d.lifeExpectancy;
      }

      function radius(d) {
          return d.population;
      }

      function color(d) {
          return d.region;
      }

      function key(d) {
          return d.name;
      }
    
      function isArray(e){
      	return toString.call(e) === "[object Array]";
      }
    
      function _setSize(e){
      	if(!isArray(e)) return false;
      	width = e[0] - margin.right - margin.left,
          height = e[1] - margin.top - margin.bottom;
      }
    
      function _getSize(){
      	return [width,height];
      }
    
      // TO-DO
      function _resize(){
  		_setSize(_getWrapperSize());
		
      }
        
  	// Gets and sets the initial and final year
  	function _setMinAndMaxFromDataObject(){
	
          _n = dataObject.slice(0);
    
          var arrYears = _n.map(function (d) {
              return d.income.slice(0).map(function (v, i) {
                  return v[0];
              })
          });

          for (rw = 0; rw < arrYears.length; rw++) {
              yMax = (yMax > Math.max.apply(Math, arrYears[rw])) ?
                  yMax : Math.max.apply(Math, arrYears[rw]);
              yMin = (yMin < Math.min.apply(Math, arrYears[rw])) ?
                  yMin : Math.min.apply(Math, arrYears[rw]);
          }

  	}
	
  	// Starts the transition from the beginning
  	function _play(){
  		svg.transition()
              .duration(transDuration)
              .ease("linear")
              .tween("year", tweenYear)
              .each("end", enableInteraction);
  	}
	
  	function _getWrapperSize(){
  		return [parseInt(mot.attr("width"),10),
  			parseInt(mot.attr("height"),10)]
  	}

  	function _createElements(){
  		d3.select('svg').remove();
  		// Various scales. These domains make assumptions of data, naturally.
  		xScale = d3.scale.log().domain([300, 1e5]).range([0, width]);
  		yScale = d3.scale.linear().domain([10, 85]).range([height, 0]);
  		radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]);
  		colorScale = d3.scale.category10();

  		// The x & y axes.
  		xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d"));
  		yAxis = d3.svg.axis().scale(yScale).orient("left");

  		// Create the SVG container and set the origin.
  		svg = mot.append("svg")
  			.attr("width", width + margin.left + margin.right)
  			.attr("height", height + margin.top + margin.bottom)
  			.append("g")
  			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  		// Add the x-axis.
  		svg.append("g")
  			.attr("class", "x axis")
  			.attr("transform", "translate(0," + height + ")")
  			.call(xAxis);

  		// Add the y-axis.
  		svg.append("g")
  			.attr("class", "y axis")
  			.call(yAxis);

  		// Add an x-axis label.
  		svg.append("text")
  			.attr("class", "x label")
  			.attr("text-anchor", "end")
  			.attr("x", width)
  			.attr("y", height - 6)
  			.text(chartTitle);

  		// Add a y-axis label.
  		svg.append("text")
  			.attr("class", "y label")
  			.attr("text-anchor", "end")
  			.attr("y", 6)
  			.attr("dy", ".75em")
  			.attr("transform", "rotate(-90)")
  			.text(yAxisText);

  		// Add the year label; the value is set on transition.
  		label = svg.append("text")
  			.attr("class", "year label")
  			.attr("text-anchor", "end")
  			.attr("y", height - 24)
  			.attr("x", width);
  		return this;
  	}

      // data-dependant innitializations
      function _init() {
    	
      	//_setSize(_getWrapperSize);
      	_createElements();
  		_setMinAndMaxFromDataObject();
		
  		label.text(yMin);
		
          // A bisector since many nation's data is sparsely-defined.
          bisect = d3.bisector(function (d) {
              return d[0];
          });

          // Add a dot per nation. Initialize the data at yMin, and set the colors.
          dot = svg.append("g")
              .attr("class", "dots")
              .selectAll(".dot")
              .data(interpolateData(yMin))
              .enter().append("circle")
              .attr("class", "dot")
              .style("fill", function (d) {
                  return colorScale(color(d));
              })
              .call(position)
              .sort(order);

          // Add a title.
          dot.append("title")
              .text(function (d) {
                  return d.name;
              });

          // Add an overlay for the year label.
          box = label.node().getBBox();

          overlay = svg.append("rect")
              .attr("class", "overlay")
              .attr("x", box.x)
              .attr("y", box.y)
              .attr("width", box.width)
              .attr("height", box.height)
              .on("mouseover", enableInteraction);

          return this;
      }

  	// Positions the dots based on data.
  	function position(dot) {
  		dot.attr("cx", function (d) {
  			return xScale(x(d));
  		})
  			.attr("cy", function (d) {
  				return yScale(y(d));
  			})
  			.attr("r", function (d) {
  				return radiusScale(radius(d));
  			});
  	}

  	// Defines a sort order so that the smallest dots are drawn on top.
  	function order(a, b) {
  		return radius(b) - radius(a);
  	}

  	// After the transition finishes, you can mouseover to change the year.
  	function enableInteraction() {
  		var yearScale = d3.scale.linear()
  			.domain([yMin, yMax])
  			.range([box.x + 10, box.x + box.width - 10])
  			.clamp(true);

  		// Cancel the current transition, if any.
  		svg.transition().duration(0);

  		overlay
  			.on("mouseover", mouseover)
  			.on("mouseout", mouseout)
  			.on("mousemove", mousemove)
  			.on("touchmove", mousemove);

  		function mouseover() {
  			label.classed("active", true);
  		}

  		function mouseout() {
  			label.classed("active", false);
  		}

  		function mousemove() {
  			displayYear(yearScale.invert(d3.mouse(this)[0]));
  		}
  	}

  	// Tweens the entire chart by first tweening the year, and then the data.
  	// For the interpolated data, the dots and label are redrawn.
  	function tweenYear() {
  		var year = d3.interpolateNumber(yMin, yMax);
  		return function (t) {
  			displayYear(year(t));
  		};
  	}

  	// Updates the display to show the specified year.
  	function displayYear(year) {
  		dot.data(interpolateData(year), key).call(position).sort(order);
  		label.text(Math.round(year));
  	}

  	// Interpolates the dataset for the given (fractional) year.
  	function interpolateData(year) {
  		return dataObject.map(function (d) {
  			return {
  				name: d.name,
  				region: d.region,
  				income: interpolateValues(d.income, year),
  				population: interpolateValues(d.population, year),
  				lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
  			};
  		});
  	}

  	// Finds (and possibly interpolates) the value for the specified year.
  	function interpolateValues(values, year) {
  		var i = bisect.left(values, year, 0, values.length - 1),
  			a = values[i];
  		if (i > 0) {
  			var b = values[i - 1],
  				t = (year - a[0]) / (b[0] - a[0]);
  			return a[1] * (1 - t) + b[1] * t;
  		}
  		return a[1];
  	}
	
  	function _setSelector(sel){
  		chartSel = sel;
  		mot = d3.select(chartSel);
  	}
    
      return {
      	init:_init,
      	setSize:_setSize,
      	getSize:_getSize,
      	play:_play,
      	resize:_resize,
      	setData:_setData,
      	setSelector:_setSelector
      };


  }
});