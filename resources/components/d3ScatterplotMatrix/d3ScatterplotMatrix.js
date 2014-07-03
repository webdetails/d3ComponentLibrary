/*
 * d3 Calendar View, using the D3ComponentBase
 */

var D3ScatterplotMatrixComponent = D3ComponentBase.extend({

  defaultWidth: 600,
  defaultHeight: 136,
  cellSize: 17,

  _defaultTooltipFormat: function(d, v) {
    return d + ": " + v;
  },

  render: function(data) {

  /*
   * Changes made to the original sample:
   * 
   * 1. Width and Height to this.getWidth(), this.getHeight()
   * 2. d3.select("body") to "#"+this.htmlObject
   * 3. instead of hardcoded samples, get it from the data
   * 
   */

	 var width = this.getWidth();

	 var flowers = this.cdaResultToD3Array(data);

	 // Size parameters.
	 var padding = 10 ,
	 traits = _.pluck(data.metadata,"colName").splice(1),
	 n = traits.length,
	 size = Math.floor((width - 10)/n),
	 padding = 10,
	 species = data.metadata[0].colName,
	 traitsMapper = {};

	 var height = width + n*20 + 40;
	 
	 // Get the distinct values for the entries and store in traitsMapper so
	 // it's easier to access

	 var entries = _.chain(data.resultset)
	 .map(function(d){return d[0]})
	 .uniq()
	 .value();

	 entries.map(function(d,idx){
			 traitsMapper[d] = idx 
		 });

	 // Position scales.
	 var x = {}, y = {};

	 traits.forEach(function(trait) {
	
			 // Coerce values to numbers.
			 flowers.forEach(function(d) { d[trait] = (+d[trait]); });

			 var value = function(d) { return d[trait]; },
			 domain = [d3.min(flowers, value), d3.max(flowers, value)],
			 range = [padding / 2, size - padding / 2];
			 x[trait] = d3.scale.linear().domain(domain).range(range);
			 y[trait] = d3.scale.linear().domain(domain).range(range.slice().reverse());
		 });

	 // Axes.
	 var axis = d3.svg.axis()
	 .ticks(5)
	 .tickSize(size * n);

	 // Brush.
	 var brush = d3.svg.brush()
	 .on("brushstart", brushstart)
	 .on("brush", brush)
	 .on("brushend", brushend);

	 // Root panel.
	 var svg = d3.select("#"+this.htmlObject).selectAll("svg")
	 var svg = d3.select("#"+this.htmlObject).append("svg:svg")
	 .attr("class","d3ScatterplotMatrix")
	 .attr("width", width)
	 .attr("height", height)
	 .append("svg:g")
	 //.attr("transform", "translate(359.5,69.5)");

	 // Legend.
	 var legend = svg.selectAll("g.legend")
	 .data(entries)
	 .enter().append("svg:g")
	 .attr("class", "legend")
	 .attr("transform", function(d, i) { return "translate(10," + (i * 20 + width + 40) +")"; });

	 legend.append("svg:circle")
	 .attr("class", function(d){ return "col" + traitsMapper[d] })
	 .attr("r", 3);

	 legend.append("svg:text")
	 .attr("x", 12)
	 .attr("dy", ".31em")
	 .text(function(d) { return d; });

	 // X-axis.
	 svg.selectAll("g.x.axis")
	 .data(traits)
	 .enter().append("svg:g")
	 .attr("class", "x axis")
	 .attr("transform", function(d, i) { return "translate(" + i * size + ",0)"; })
	 .each(function(d) { d3.select(this).call(axis.scale(x[d]).orient("bottom")); });

	 // Y-axis.
	 svg.selectAll("g.y.axis")
	 .data(traits)
	 .enter().append("svg:g")
	 .attr("class", "y axis")
	 .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
	 .each(function(d) { d3.select(this).call(axis.scale(y[d]).orient("right")); });

	 // Cell and plot.
	 var cell = svg.selectAll("g.cell")
	 .data(cross(traits, traits))
	 .enter().append("svg:g")
	 .attr("class", "cell")
	 .attr("transform", function(d) { return "translate(" + d.i * size + "," + d.j * size + ")"; })
	 .each(plot);

	 // Titles for the diagonal.
	 cell.filter(function(d) { return d.i == d.j; }).append("svg:text")
	 .attr("x", padding)
	 .attr("y", padding)
	 .attr("dy", ".71em")
	 .text(function(d) { return d.x; });

	 function plot(p) {
		 var cell = d3.select(this);

		 // Plot frame.
		 cell.append("svg:rect")
		 .attr("class", "frame")
		 .attr("x", padding / 2)
		 .attr("y", padding / 2)
		 .attr("width", size - padding)
		 .attr("height", size - padding);

		 // Plot dots.
		 cell.selectAll("circle")
		 .data(flowers)
		 .enter().append("svg:circle")
		 .attr("class", function(d) { return "col" + traitsMapper[d[species]] })
		 .attr("cx", function(d) { return x[p.x](d[p.x]); })
		 .attr("cy", function(d) { return y[p.y](d[p.y]); })
		 .attr("r", 3);

		 // Plot brush.
		 cell.call(brush.x(x[p.x]).y(y[p.y]));
	 }

	 // Clear the previously-active brush, if any.
	 function brushstart(p) {
		 if (brush.data !== p) {
			 cell.call(brush.clear());
			 brush.x(x[p.x]).y(y[p.y]).data = p;
		 }
	 }

	 // Highlight the selected circles.
	 function brush(p) {
		 var e = brush.extent();
		 svg.selectAll(".cell circle").attr("class", function(d) {
				 return e[0][0] <= d[p.x] && d[p.x] <= e[1][0]
				 && e[0][1] <= d[p.y] && d[p.y] <= e[1][1]
				 ? "col" + traitsMapper[d[species]] : null;
			 });
	 }

	 // If the brush is empty, select all circles.
	 function brushend() {
		 if (brush.empty()) svg.selectAll(".cell circle").attr("class", function(d) {
				 return "col" + traitsMapper[d[species]];
			 });
	 }

	 function cross(a, b) {
		 var c = [], n = a.length, m = b.length, i, j;
		 for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
		 return c;
	 }


  }
  
});


