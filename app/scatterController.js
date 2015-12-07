;(function() {

  angular
    .module('boilerplate')
    .controller('scatterController', scatterController);

  scatterController.$inject = ['$scope' ,'LocalStorage', 'QueryService', '$timeout'];

	
	function scatterController($scope, LocalStorage, QueryService, $timeout) {

		

		var materialObjects = [];
		var dataArray = [];

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
							'placeArray': [],
							'y': 0,
							'relationArray': [] 
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
			//console.log(materialObjects);
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

			var meanArray = [
	    		{'yearInterval': [1500,1550], 'mean': 0, 'count': 0},
	    		{'yearInterval': [1550,1600], 'mean': 0, 'count': 0},
	    		{'yearInterval': [1600,1650], 'mean': 0, 'count': 0},
	    		{'yearInterval': [1650,1700], 'mean': 0, 'count': 0},
	    		{'yearInterval': [1700,1750], 'mean': 0, 'count': 0},
	    		{'yearInterval': [1750,1800], 'mean': 0, 'count': 0},
	    		{'yearInterval': [1800,1850], 'mean': 0, 'count': 0},
	    		{'yearInterval': [1850,1900], 'mean': 0, 'count': 0}
	    	];
			for (var i = 0 ; i < array.length ; i++) {

				var yearAmountArray = array[i].yearAmountArray;
				

				for (var j = 0 ; j < yearAmountArray.length ; j++) {
					//if (yearAmountArray[j].amount != 0){
						meanArray[j].mean += yearAmountArray[j].amount;
						meanArray[j].count += 1;
					//}
					
				}
			}
		
			for (var i = 0 ; i < meanArray.length ; i++){
				var mean = meanArray[i].mean;
				var count = meanArray[i].count;
				meanArray[i].mean =  mean/count;
			}
			//console.log(meanArray);
			addRelation(meanArray);
		}

		setTimeout(function(){ calcMean(materialObjects)}, 1000);

		function addRelation(meanArray) {

			for (var i = 0 ; i < materialObjects.length ;  i++){
				var yearArray = materialObjects[i].yearAmountArray;
				
				var relation = []; 
				for (var j = 0 ; j < yearArray.length ; j++) {
					var val = yearArray[j].amount/meanArray[j].mean;
					relation.push(val);
				}
				var tot = 0;
				for (var k = (relation.length - 1) ; k > 0 ; k--){
					tot += relation[k]-relation[k-1];

				}
				var meanRelation = tot/(relation.length);
				materialObjects[i].y = meanRelation;
				materialObjects[i].relationArray = relation;
				
			}
			
			
			refineObjectArray()		

		}
		function refineObjectArray(){
			
			for (var i = 0 ; i < materialObjects.length ; i++){
				if (materialObjects[i].totalAmount > 500) {
					dataArray.push(materialObjects[i]);
				} 
			}
			setDots();	
		}

		//The beginning of the scatterplot
		var tooltip = d3.select("body")
		    .append("div")
		    .attr("class", "tooltip")	
		    .style("position", "absolute")
		    .style("z-index", "10")
		    .style("visibility", "hidden")
		    .style("background", "#FFF")
		    .style("padding", "5px")
		    .style("border-radius", "2px");

		
		       
		var data = [[2,3], [1,-1], [11,4], [2,8], [1,6], [4,4], [7,10], [72,45]]; 
		var dataName = ["ewe", "600", "16", "1rtgf", "fg50", "1700", "10", "1900"];    

	    var margin = {top: 20, right: 15, bottom: 60, left: 60}
	      , width = 560 - margin.left - margin.right
	      , height = 400 - margin.top - margin.bottom;
	    
	    var x = d3.scale.linear()
	              .domain([0, d3.max(data, function(d) { return 6000; })])
	              .range([ 0, width ]);
	    
	    var y = d3.scale.linear()
	    	      .domain([-45, d3.max(data, function(d) { return d[1]; })])
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
	    function setDots(){
		    g.selectAll("scatter-dots")
		      .data(dataArray)
		      .enter().append("svg:circle")
		          .attr("cx", function (d,i) { return x(d.totalAmount); } )
		          .attr("cy", function (d) { return y(d.y); } )
		          .attr("r", 2)
		          .style("fill", function(d) { 
		          	
		          	var wordlength = Math.floor(d.material.length/4);

		          	var R = Math.floor(Math.random()*10);
		          	var G = Math.floor(Math.random()*10);
		          	var B = Math.floor(Math.random()*10);
		          	return '#'+R+'c'+G+'e'+B+'9'; 
		          })
		          .on("mouseover", function(d,i){ 
		          	d3.select(this).attr("r", 7); 
		          	plot(d.placeArray);
		          	
		          	console.log(d);

		          	tooltip.style("visibility", "visible");
	          		tooltip.style("height", "250px");
	          		tooltip.style("width", "20%");
	          		tooltip.text(d.material);
	          		tooltip.html("<p>"+d.material+"</p> <div class = 'graphTest'></div>"+"<div style='font-size: 50%; margin-top:-8px; margin-left:-20px;'>1500 --------- 1900</div>");
		          	
		          	

		          	var dataset = [
			          		d.relationArray[0],
			          		d.relationArray[1],
			          		d.relationArray[2],
			          		d.relationArray[3],
			          		d.relationArray[4],
			          		d.relationArray[5],
			          		d.relationArray[6],
			          		d.relationArray[7]
						];

					var svg = d3.select(".graphTest")
					   .append("svg")
					   .attr("preserveAspectRatio", "xMidYMid")
					   .attr("viewBox", "0 0 1100 500");

					var svgRect = svg.selectAll("rect")
					                  .data(dataset)
					                  .enter();  

		          	svgRect.append("rect")
					   .attr("x", function(d, i){ return i * 120; }) 
					   .attr("y", function(d){
						    var yPos = 465 - (d);
						    return yPos;
					   })
					   .attr("height", function(d){
					      if(d==0) return 10; 
					      return d*10;
					   })
					   .attr("width", 100)
					   .attr("fill", function(d, i) { return "#f2e"; });


		          })
			   	  .on("mousemove", function(){
			   	  	return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").text();
			   	  })
			   	  .on("mouseout", function(){
			   	  	d3.select(this).attr("r", 2); 
			   	  	dePlot(); 
			   	  	return tooltip.style("visibility", "hidden");
			   	  });
			   	  

		}

		//Kartan
		var bombMap = new Datamap({
	    	element: document.getElementById('map_bombs'),
	    	scope: 'world',
	    	geographyConfig: {
		        popupOnHover: false,
		        highlightOnHover: false
    		},
		    fills: {
		        'dotFill' : '#E518FF',
		        defaultFill: '#5CB207'
		    }
		});

		function plot(occ){
	      $.getJSON("data.json", function(json) {
	        var array = [];
	        for (var i = 0 ; i < json.length ; i++) {
	          for (var j = 0 ; j < occ.length ; j++){
	            if (json[i].CountryName.toLowerCase() == occ[j].toLowerCase()) {
	              array.push({
	                name: json[i].CountryName, 
	                fillKey: 'dotFill', 
	                latitude: json[i].CapitalLatitude, 
	                longitude: json[i].CapitalLongitude, 
	                radius: 3,
	                "yearInterval" : occ[j].yearInterval
	              });
	            }
	          }
	        }   
	        bombMap.bubbles(array, {
	          popupTemplate: function(geo, array) {
	            return "<div class='hoverinfo'>Bubble for " + array.name;
	          }
	        });
	      });
	    }
	    function dePlot(){
	    	bombMap.bubbles([], {
	          popupTemplate: function(geo, array) {
	            return "<div class='hoverinfo'>Bubble for " + array.name;
	          }
	        });
	    }



	}
})();