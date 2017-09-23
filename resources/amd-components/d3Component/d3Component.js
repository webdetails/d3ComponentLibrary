
/*
 * d3 component, using the d3ComponentBase
 */
define([
  './commons/d3ComponentBase'
], function(
  D3ComponentBase,
  d3
) {
  return D3ComponentBase.extend({

    defaultWidth: 600,
    defaultHeight: 400

  });
});
