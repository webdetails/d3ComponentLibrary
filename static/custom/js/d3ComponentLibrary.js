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
  var visualizationImg = {
    name: "visualizationImg",
    label: "visualizationImg",
    defaults: {
    },
    init: function(){
        
      // Register this for datatables sort
      var myself = this;
      $.fn.dataTableExt.oSort[this.name+'-asc'] = function(a,b){
        return myself.sort(a,b)
      };
      $.fn.dataTableExt.oSort[this.name+'-desc'] = function(a,b){
        return myself.sort(b,a)
      };     
    }, 
    sort: function(a,b){
      return a - b;
    }, 

    implementation: function (tgt, st, opt) {
      var t = $(tgt);
      t.empty().append("<img width='202' src='../../../api/repos/d3ComponentLibrary/static/custom/img/" + st.value + ".png'>");
    }
  };

Dashboards.registerAddIn("Table", "colType", new AddIn(visualizationImg));
