/**
 * RequireJS configuration file for d3ComponentLibrary
 */

(function() {

  var requirePaths = requireCfg.paths;

  var prefix;
  if(typeof KARMA_RUN !== "undefined") { // unit tests
    prefix = requirePaths['d3ComponentLibrary/components'] = 'resources/amd-components';

  } else if(typeof CONTEXT_PATH !== "undefined") { // production
    prefix = requirePaths['d3ComponentLibrary/components']  = CONTEXT_PATH + 'api/repos/d3ComponentLibrary/resources/amd-components';

  } else if(typeof FULL_QUALIFIED_URL != "undefined") { // embedded production
    prefix = requirePaths['d3ComponentLibrary/components']  = FULL_QUALIFIED_URL + 'api/repos/d3ComponentLibrary/resources/amd-componentss';

  } else { // build
    prefix = requirePaths['d3ComponentLibrary/components'] = '../resources/amd-components';
  }

  requirePaths['d3ComponentLibrary/lib/d3'] = prefix + '/../components/commons/lib/d3';  
  requirePaths['d3ComponentLibrary/components/D3BoxPlotsComponent'] = prefix + '/d3BoxPlots/d3BoxPlots';
  requirePaths['d3ComponentLibrary/components/D3CalendarViewComponent'] = prefix + '/d3CalendarView/d3CalendarView';
  requirePaths['d3ComponentLibrary/components/D3Component'] = prefix + '/d3Component/d3Component';
  requirePaths['d3ComponentLibrary/components/D3MotionScatterPlotComponent'] = prefix + '/d3MotionScatterPlot/d3MotionScatterPlot';
  requirePaths['d3ComponentLibrary/components/D3ScatterplotMatrixComponent'] = prefix + '/d3ScatterplotMatrix/d3ScatterplotMatrix'; 
})();