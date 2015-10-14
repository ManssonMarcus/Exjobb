/**
 * Main application controller
 *
 * You can use this controller for your whole app if it is small
 * or you can have separate controllers for each logical section
 * 
 */
;(function() {

  angular
    .module('boilerplate')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope' ,'LocalStorage', 'QueryService', '$timeout'];


  function MainController($scope, LocalStorage, QueryService, $timeout) {



    // Local variables
    var alljson = [];
    var LSHjson = [];
    var thejson = [];
    var startYear;
    var snapSlider = document.getElementById('slider-snap');
    var snapValues = [
      document.getElementById('slider-snap-value-lower'),
      document.getElementById('slider-snap-value-upper')
    ];
    var text = document.getElementById('textId');
    var firstText = "";
    var secondText = "";
    var thirdText = "";
    var fourthText = "";
    var fifthText = "";
    var sixthText = "";
    var seventhText = "";
    var eighthText = "";
    

    //get datasets for all museums & LSH
    $.getJSON("geoYearData/LSH/allLSHUtanSvea.json", function(json) {
      LSHjson = json;
    });
    $.getJSON("geoYearData/utanSvea.json", function(json) {
      alljson = json;
      thejson = json;
    });


    //get texts for yearspans
    jQuery.get('texts/1500-1550.txt', function(data) {
      firstText = data;
    });
    jQuery.get('texts/1550-1600.txt', function(data) {
      secondText = data;
    });
    jQuery.get('texts/1600-1650.txt', function(data) {
      thirdText = data;
    });    
    jQuery.get('texts/1650-1700.txt', function(data) {
      fourthText = data;
    });
    jQuery.get('texts/1700-1750.txt', function(data) {
      fifthText = data;
    });
    jQuery.get('texts/1750-1800.txt', function(data) {
      sixthText = data;
    });
    jQuery.get('texts/1800-1850.txt', function(data) {
      seventhText = data;
    });
    jQuery.get('texts/1850-1900.txt', function(data) {
      eighthText = data;
    });

    // 'controller as' syntax
    var self = this;
    

    // initialize map with center, zoom & colors
    var zoom = new Datamap({
      element: document.getElementById("mapContainer"),
      responsive: true,
      scope: 'world',

      // Zoom in on europe
      setProjection: function(element) {
        var projection = d3.geo.equirectangular()
          .center([15.44, 57.7605])
          .rotate([4.4, 0])
          .scale(200)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
          .projection(projection);
        
        return {path: path, projection: projection};
      },
      fills: {
            'RUS': '#66FFF6',
            defaultFill: '#B2A464'
        }
    });

    //stupid way of initializing dots on the map, needs to change
    setTimeout(function(){ setPlotYear(startYear)}, 500);

    //Listen to radiobutton to assign right dataset to thejson
    $scope.newValue = function(value) {
      if (value == "LSH") {
        thejson = LSHjson;
        setPlotYear(startYear);
      }
      else {
        thejson = alljson;
        setPlotYear(startYear);
      }
    }

    //set right yearSpan for plot
    function setPlotYear(startYear) {
      tempArray = [];
        for (var i = 0 ; i < thejson.length ; i++){
          if(startYear == thejson[i].yearInterval[0]) {
              tempArray.push(thejson[i]);
          }
          if (i+1 == thejson.length) {
            plot(tempArray);
          }
        }
    }

    //simple plot-function
    function plot(occ){
      $.getJSON("data.json", function(json) {
        var array = [];
        for (var i = 0 ; i < json.length ; i++) {
          for (var j = 0 ; j < occ.length ; j++){
            if (json[i].CountryName.toLowerCase() == occ[j].placeName.toLowerCase()) {
              array.push({name: json[i].CountryName, fillKey: 'RUS', latitude: json[i].CapitalLatitude, longitude: json[i].CapitalLongitude, radius: occ[j].amount});
            }
          }
        }     
        zoom.bubbles(array, {
          popupTemplate: function(geo) {
            return "<div class='hoverinfo'>Bubble for " + "array.countryName";
          }
        });
      });
    }

    //preferences for range-slider
    noUiSlider.create(snapSlider, {
      start: 1500,
      snap: true,
      connect: false,
      range: {
        'min': 1500,
        '15%': 1550,
        '30%': 1600,
        '45%': 1650,
        '60%': 1700,
        '75%': 1750,
        '90%': 1800,
        'max': 1850
      }
    });


    function changeText(value) {
      if (value == 1500) {
          setTimeout(function(){ text.innerHTML = firstText;}, 100);
      }
      if (value == 1550) {
        setTimeout(function(){ text.innerHTML = secondText}, 100); 
      }
      if (value == 1600) {
        setTimeout(function(){ text.innerHTML = thirdText}, 100); 
      }
      if (value == 1650) {
        setTimeout(function(){ text.innerHTML = fourthText}, 100); 
      }
      if (value == 1700) {
        setTimeout(function(){ text.innerHTML = fifthText}, 100); 
      }
      if (value == 1750) {
        setTimeout(function(){ text.innerHTML = sixthText}, 100); 
      }
      if (value == 1800) {
        setTimeout(function(){ text.innerHTML = seventhText}, 100); 
      }
      if (value == 1850) {
        setTimeout(function(){ text.innerHTML = eighthText}, 100); 
      }
    }

    //get values from range-slider
    snapSlider.noUiSlider.on('update', function( values, handle ) {
      startYear = parseInt(values[0]);
      changeText(parseInt(values[0]));
      setPlotYear(startYear);
      snapValues[handle].innerHTML = startYear+"-"+ (startYear+50);
    });

  }


})();