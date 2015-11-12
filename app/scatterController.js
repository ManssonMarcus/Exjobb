;(function() {

  angular
    .module('boilerplate')
    .controller('scatterController', scatterController);

  scatterController.$inject = ['$scope' ,'LocalStorage', 'QueryService', '$timeout'];

	
	function scatterController($scope, LocalStorage, QueryService, $timeout) {

		var materialObjects = [];

		$.getJSON("geoData/all.json", function(json) {
			for (var i = 0 ; i < json.length ; i++ ) {

				var materialArray = json[i].materialArray;

				for (var j = 0 ; j < materialArray.length ; j++) {
					var material = materialArray[j].material;
					var index = containsMaterial(material, materialObjects);
					if ( index == -1) {
						materialObjects.push({
							'material': material, 
							'totalAmount': materialArray[j].materialAmount,
							'yearAmountArray': placeAmountYear(json[i].yearInterval , materialArray[j].materialAmount) ,
							'placeArray': [] 
						});
						
						if (materialObjects[j].placeArray.indexOf(json[i].placeName) == -1) {
							materialObjects[j].placeArray.push(json[i].placeName);
						}	
					}
					else {
						materialObjects[index].totalAmount += materialArray[j].materialAmount;
						for (var k = 0 ; k < materialObjects[index].yearAmountArray.length ; k++){
							if (materialObjects[index].yearAmountArray[k].yearInterval[0] == json[i].yearInterval[0]) {
								materialObjects[index].yearAmountArray[k].amount += materialArray[j].materialAmount;
							}
						}
						if (materialObjects[j].placeArray.indexOf(json[i].placeName) == -1) {
							materialObjects[j].placeArray.push(json[i].placeName);
						}	
					}
				}
			}
			console.log(materialObjects);
	    });


	    function placeAmountYear(yearInterval, amount) {
	    	var yearArray = [
	    		{'yearInterval': [1500,1550], 'amount': 0},
	    		{'yearInterval': [1550,1600], 'amount': 0},
	    		{'yearInterval': [1600,1650], 'amount': 0},
	    		{'yearInterval': [1650,1700], 'amount': 0},
	    		{'yearInterval': [1700,1750], 'amount': 0},
	    		{'yearInterval': [1750,1800], 'amount': 0},
	    		{'yearInterval': [1800,1850], 'amount': 0},
	    		{'yearInterval': [1850,1900], 'amount': 0}
	    	];
	    	for (var i = 0 ; i < yearArray.length ; i++) {
	    		if (yearInterval[0] == yearArray[i].yearInterval[0]){
	    			yearArray[i].amount += amount;
	    			return yearArray;
	    		}

	    	}
	    }

		function containsMaterial(material, array) {
			
			for (var i = 0; i < array.length; i++) {
				if (array[i].material == material) {
					return i;
				}
			}
			return -1;
		}
		function calcMean(array) {
			var first = 0;
			var meanArray = [
	    		{'yearInterval': [1500,1550], 'mean': 0},
	    		{'yearInterval': [1550,1600], 'mean': 0},
	    		{'yearInterval': [1600,1650], 'mean': 0},
	    		{'yearInterval': [1650,1700], 'mean': 0},
	    		{'yearInterval': [1700,1750], 'mean': 0},
	    		{'yearInterval': [1750,1800], 'mean': 0},
	    		{'yearInterval': [1800,1850], 'mean': 0},
	    		{'yearInterval': [1850,1900], 'mean': 0}
	    	];
			for (var i = 0 ; i < array.length ; i++) {

				var yearAmountArray = array[i].yearAmountArray;

				for (var j = 0 ; j < yearAmountArray.length ; j++) {
					first += yearAmountArray[0].amount;
					meanArray[0].mean += yearAmountArray[0].amount
					
				}
			}
			
			console.log(first);
			console.log(meanArray);
		}

		setTimeout(function(){ calcMean(materialObjects)}, 1000);

		function materialRelationMean(array) {
			for (var i = 0 ; i < array ;  i++){

			}

		}

		var tooltip = d3.select("body")
		    .append("div")
		    .style("position", "absolute")
		    .style("z-index", "10")
		    .style("visibility", "hidden")
		    .style("background", "#FFF")
		    .style("padding", "5px")
		    .style("border-radius", "2px")
		    .text("a simple tooltip");

		var data = [[2,3], [1,-1], [11,4], [2,8], [1,6], [4,4], [7,10], [72,12]];
   
	    var margin = {top: 20, right: 15, bottom: 60, left: 60}
	      , width = 960 - margin.left - margin.right
	      , height = 500 - margin.top - margin.bottom;
	    
	    var x = d3.scale.linear()
	              .domain([0, d3.max(data, function(d) { return d[0]; })])
	              .range([ 0, width ]);
	    
	    var y = d3.scale.linear()
	    	      .domain([-10, d3.max(data, function(d) { return d[1]; })])
	    	      .range([ height, 0 ]);
	 
	    var chart = d3.select('.content')
		.append('svg:svg')
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.attr('class', 'chart')
		

	    var main = chart.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'main')   
	        
	    // draw the x axis
	    var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom');

	    main.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.attr('class', 'main axis date')
		.call(xAxis);

	    // draw the y axis
	    var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left');

	    main.append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'main axis date')
		.call(yAxis);

	    var g = main.append("svg:g"); 
	    
	    g.selectAll("scatter-dots")
	      .data(data)
	      .enter().append("svg:circle")
	          .attr("cx", function (d,i) { return x(d[0]); } )
	          .attr("cy", function (d) { return y(d[1]); } )
	          .attr("r", 8)
	          .on("mouseover", function(d,i){ d3.select(this).attr("r", 12); return [tooltip.style("visibility", "visible"), tooltip.text("snittimport: ")];})
		   	  .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").text();})
		   	  .on("mouseout", function(){d3.select(this).attr("r", 8); return tooltip.style("visibility", "hidden");});




	}
})();