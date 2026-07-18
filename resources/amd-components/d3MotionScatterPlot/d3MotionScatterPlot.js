/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
/*
 * d3 MotionScatterPlot using the D3ComponentBase
 */
define([
  './commons/d3ComponentBase',
  'cdf/lib/jquery',
  './d3MotionScatterPlot/MotionScatterPlot',
  'css!./d3MotionScatterPlot/d3MotionScatterPlot'
], function(
  D3ComponentBase,
  $,
  MotionScatterPlot
) {
  var motionChart = new MotionScatterPlot([],{});
		
  return D3MotionScatterPlotComponent = D3ComponentBase.extend({

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
      this.endExec();
  	}
  
  });
});