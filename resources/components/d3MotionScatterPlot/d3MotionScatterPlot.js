/*
 * d3 MotionScatterPlot using the D3ComponentBase
 */
  
var motionChart = new MotionScatterPlot([],{});
		
var D3MotionScatterPlotComponent = D3ComponentBase.extend({

	render: function(data) {
	
		var dataObject = [];
		
		$.each(data, function(i, val) {
		  dataObject.push(val);
		});
		
		motionChart.setData(dataObject);
		motionChart.setSelector("#exampleObj");
		motionChart.setSize([
			$("#exampleObj").width(),
			400,
		]);
		
		motionChart.init().play();
	
	}
  
});


