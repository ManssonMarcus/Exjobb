;(function() {

  angular
    .module('boilerplate')
    .controller('barController', barController);

  barController.$inject = ['$scope' ,'LocalStorage', 'QueryService', '$timeout'];

	
	function barController($scope, LocalStorage, QueryService, $timeout) {

		$scope.countries = [];
		$scope.listCountries = [];

		$.getJSON("geoData/all.json", function(json) {
			for (var i = 0 ;  i < json.length ; i++) {	
				//if (containsCountry(json[i].placeName, $scope.listCountries) == -1) {	
					$scope.listCountries.push(json[i]);
				//}
			}
		});  

		$scope.provideCountry = function(val) {
			console.log(val);
			getRightCountry($scope.listCountries, val.placeName);
		}

	  	function getRightCountry(array, val) {
		    for (var i = 0 ; i < array.length ; i++) {
		    	if (array[i].placeName.toLowerCase() == val.toLowerCase()){
		    		console.log(array[i]);
		    		$scope.countries.push(array[i]);
		    	}
		    }
		    setTimeout(function(){ createBar($scope.countries); $scope.countries = [] }, 200);    
		}

		function containsCountry(obj, list) {
			var i;
			for (i = 0; i < list.length; i++) {
				if (list[i].placeName === obj) {
					return i;
				}
			}
			return -1;
		}
		

		function createBar(data){

		var yearSpanOne = 0;
		var yearSpanTwo = 0;
		var yearSpanThree = 0;
		var yearSpanFour = 0;
		var yearSpanFive = 0;
		var yearSpanSix = 0;
		var yearSpanSeven = 0;
		var yearSpanEight = 0;
		var maxAmount = 1;

	   

		if(data == 0){
			console.log("data is empty")
			

		} 
		else {
			for(i = 0; i <= (data.length -1); i++){
				if (data[i].amount > maxAmount) {
					maxAmount = data[i].amount;
				}
				if(data[i].yearInterval[0] == 1500) {var yearSpanOne = data[i].amount;}
				else if(data[i].yearInterval[0] == 1550) { var yearSpanTwo = data[i].amount; }
				else if(data[i].yearInterval[0] == 1600) {var yearSpanThree = data[i].amount; }
				else if(data[i].yearInterval[0] == 1650) {var yearSpanFour = data[i].amount; }
				else if(data[i].yearInterval[0] == 1700) {var yearSpanFive = data[i].amount; }
				else if(data[i].yearInterval[0] == 1750) { var yearSpanSix = data[i].amount; }
				else if(data[i].yearInterval[0] == 1800){ var yearSpanSeven = data[i].amount;}
				else {var yearSpanEight = data[i].amount; }
			}
		} 

		$('.graph').empty();
		
		var h = 495;
		var putDown = maxAmount/8;
		var barSize = h/(maxAmount + putDown);
		var barPos = 465;

		var dataset = [yearSpanOne, yearSpanTwo, yearSpanThree, yearSpanFour, yearSpanFive, yearSpanSix, yearSpanSeven, yearSpanEight];
		// var dataset = [2.334, 9, 0, 10, 1, 6.1];
		var dataName = ["1500-1550", "1550-1600", "1600-1650", "1650-1700", "1700-1750", "1750-1800", "1800-1850", "1850-1900"];
		//orange, röd, blå, grönturkos, gul, violet
		var colors = ["#3857FF", "#337FE8", "#45C4FF", "#33DEE8", "#38FFD2", "#27E886", "#2BFF57","#2FE81C"];

		// creating the svg
		var svg = d3.select(".graph")
		   .append("svg")
		   .attr("preserveAspectRatio", "xMidYMid")
		   .attr("viewBox", "0 0 1100 500")

		var svgRect = svg.selectAll("rect")
		                  .data(dataset)
		                  .enter()

		var svgText = svg.selectAll("text")
		                  .data(dataset)
		                  .enter()
		

		svgRect.append("rect")
		   .attr("x", function(d, i){ return i * 120; }) 
		   .attr("y", function(d){
			    var yPos = 465 - (d*barSize);
			    return yPos;
		   })
		   .attr("height", function(d){
		      if(d==0) return 3; 
		      return d*barSize;
		   })
		   .attr("width", 80)
		   .attr("fill", function(d, i) { return colors[i]; });

		// De övra stolparna
		svgRect.append("rect")  
		   .attr("x", function(d, i){ return i * 120;}) 
		   .attr("height", barPos)
		   .attr("width", 80)
		   .attr("opacity", 0.3)
		   .attr("fill", function(d, i) { return colors[i]; });


		 //Dataset value
		 svgText.append("text")
		   .attr("font-size", "15px")
		   .text(function(d){
		   	if(d.toString().length > 3) return d.toFixed(1);
		   	return d; 
		   })
		   .attr("fill", "white")
		   .attr("text-anchor", "right")
		   .attr("x", function(d, i) {  
		     if(i == 0 && d.toString().length == 1) return 35; //first element
		     if(d.toString().length > 1) return (i * 120)+26;
		     return (i * 120)+35; 
		   })
		   .attr("y", function(d){
		     var yPos = 458-(d*barSize);
		     if(d==10) return 530-(d*barSize);
		     return yPos;
		   })

		// Label text
		svgText.append("text")
		  .data(dataName)
		  .attr("font-size", "15px")
		  .attr("text-anchor", "middle")
		  .text(function(d){return d; })
		  .attr("fill", "#3C3C3C")
		  .attr("x", function(d, i) {
		    return (i * 120)+40; 
		    })
		  .attr("y", h)

	}

	}


})();