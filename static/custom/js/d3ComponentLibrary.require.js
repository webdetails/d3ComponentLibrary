require([
  "cdf/Dashboard",
  "cdf/AddIn",
  "cdf/lib/jquery"
], function(
  Dashboard,
  AddIn,
  $
) {
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
  
  var dashboard = new Dashboard();
  dashboard.registerAddIn("Table", "colType", new AddIn(visualizationImg));
});