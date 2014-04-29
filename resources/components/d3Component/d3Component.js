
/*
 * d3 component, using the chartComponent
 */

 var D3Component =  ChartComponent.extend({

     update : function() {
       if (this.parameters == undefined) {
         this.parameters = [];
       };

       this.renderChart();
     },

     render: function(values) {

       this.customfunction.call(this,values);
     },

     cdaResultToD3Array: function(d){

       var result = [];
       _.each(d.resultset,function(row, o){
           var line = {};
           _.each(row,function(cell,idx){
               line[_.findWhere(d.metadata,{colIndex:idx})["colName"]] = cell;
             });
           result.push(line);
         });

       return result;
     },

     getHeight: function(){
       var $ph = this.placeholder();
       return this.height?this.height:($ph.height()>0?$ph.height():400);
     },

     getWidth: function(){
       var $ph = this.placeholder();
       return this.width?this.width:($ph.width()>0?$ph.width():600);
     }

   });


