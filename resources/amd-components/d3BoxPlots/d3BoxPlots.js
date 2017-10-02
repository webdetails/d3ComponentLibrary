/*
 * d3 Box Plot, using the D3ComponentBase
 */
define([
  './commons/d3ComponentBase',
	'amd!cdf/lib/underscore',
  './d3BoxPlots/box',
  'css!./d3BoxPlots/d3BoxPlots'
], function(
  D3ComponentBase,
  _,
  d3	
) {

  return D3ComponentBase.extend({
  	defaultMargin: {top: 10, right: 50, bottom: 20, left: 50},

  	_defaultTooltipFormat: function(d, v) {
  		return d + ": " + v;
  	},

  	render: function(data) {

  	  /*
  	   * Changes made to the original sample:
  	   * 
  	   * 1. Width and Height
  	   * 2. d3.select("body") to "#"+this.htmlObject
  	   * 
  	   * 
  	   * Arguments:
  	   * 
  	   * 
  	   */

  		var width = 120 - this.defaultMargin.left - this.defaultMargin.right,
  			height = this.boxHeight - this.defaultMargin.top - this.defaultMargin.bottom;


  		var chart = d3.box()
  			.whiskers(this.iqr(1.5))
  			.width(width)
  			.height(height);
			
  		/*	
  		var dataset = [
  			[850,740,900,1070,930,850,950,980,980,880,1000,980,930,650,760,810,1000,1000,960,960],
  			[960,940,960,940,880,800,850,880,900,840,830,790,810,880,880,830,800,790,760,800],
  			[880,880,880,860,720,720,620,860,970,950,880,910,850,870,840,840,850,840,840,840],
  			[890,810,810,820,800,770,760,740,750,760,910,920,890,860,880,720,840,850,850,780],
  			[890,840,780,810,760,810,790,810,820,850,870,870,810,740,810,940,950,800,810,870]
  		];
  		*/
		
  		var dataset = [];
		
  		_.each(data.resultset, function(row) {
  			dataset.push(row);
  		});

  		var min = Infinity,
  			max = -Infinity;
		
  		_.each(dataset, function(row) {

  			var aux_min = _.min(row);
  			if (aux_min < min) min = aux_min;

  			var aux_max = _.max(row);
  			if (aux_max > max) max = aux_max;

  		});
		
  		chart.domain([min, max]);
		
  		var svg = d3.select("#"+this.htmlObject).selectAll("svg")
  			.data(dataset)
  			.enter().append("svg")
  			.attr("class", "box")
  			.attr("width", width + this.defaultMargin.left + this.defaultMargin.right)
  			.attr("height", height + this.defaultMargin.bottom + this.defaultMargin.top)
  			.append("g")
  			.attr("transform", "translate(" + this.defaultMargin.left + "," + this.defaultMargin.top + ")")
  			.call(chart);		
        
      this.endExec();
  	}, 
	
  	// Returns a function to compute the interquartile range.
  	iqr: function(k) {
  	  return function(d, i) {
  		var q1 = d.quartiles[0],
  			q3 = d.quartiles[2],
  			iqr = (q3 - q1) * k,
  			i = -1,
  			j = d.length;
  		while (d[++i] < q1 - iqr);
  		while (d[--j] > q3 + iqr);
  		return [i, j];
  	  };
  	} 
  });
});

