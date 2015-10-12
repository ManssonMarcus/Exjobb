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

  MainController.$inject = ['$scope' ,'LocalStorage', 'QueryService'];


  function MainController($scope, LocalStorage, QueryService) {

    // 'controller as' syntax
    var self = this;

    $scope.featureList = ["Responsive navigation", "SASS support including sourceMaps", "Minimal CSS styling of the view"];

    //////////// CALL all data on first load.

  
        $.ajax({
          //dataType: "json",
          url: 'http://kulturarvsdata.se/ksamsok/api?stylesheet=&recordSchema=presentation&x-api=lsh772&method=search&hitsPerPage=500&sort=countryName&startRecord='+1+'&query=create_toTime%3E%3D'+ 1500 +'+and+create_fromTime%3C%3D'+1900,
          type: 'GET',
          withCredentials: true,
      })
      .done(function(data) {
        console.log(data);

      }).fail(function(req) { 
        console.log("err");
      });


  /*  
    allData = [];

    for (var i = 1500 ; i <= 1900; i = i+50) {
      $.ajax({
          //dataType: "json",
          url: 'http://kulturarvsdata.se/ksamsok/api?stylesheet=&recordSchema=presentation&x-api=lsh772&method=search&hitsPerPage=500&sort=serviceOrganization&startRecord='+1+'&query=create_toTime%3E%3D'+ i +'+and+create_fromTime%3C%3D'+(i+50),
          type: 'GET',
          withCredentials: true,
      })
      .done(function(data) {

        for (var j = 0 ; j < 100 ; j++) {

          country = data.getElementsByTagName("countryName")[j].childNodes[0].nodeValue;

          allData.push({"country": country , "yearFrom": i});

        };

        console.log(data);
        console.log(allData);

      }).fail(function(req) { 
        console.log("err");
      });
    };

*/
    ////////////  function definitions
    
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
        'USA': '#1f77b4',
        'RUS': '#9467bd',
        'PRK': '#ff7f0e',
        'PRC': '#2ca02c',
        'IND': '#e377c2',
        'GBR': '#8c564b',
        'FRA': '#d62728',
        'PAK': '#7f7f7f',
        defaultFill: '#44DC55'
    },
  data: { 
    'ZAF': { fillKey: 'gt50' },
    'ZWE': { fillKey: 'lt25' },
    'NGA': { fillKey: 'lt50' },
    'MOZ': { fillKey: 'eq50' },
    'MDG': { fillKey: 'eq50' },
    'EGY': { fillKey: 'gt75' },
    'TZA': { fillKey: 'gt75' },
    'LBY': { fillKey: 'eq0' },
    'DZA': { fillKey: 'gt500' },
    'SSD': { fillKey: 'pink' },
    'SOM': { fillKey: 'gt50' },
    'GIB': { fillKey: 'eq50' },
    'AGO': { fillKey: 'lt50' }
  }
});

var countryArray = [];
var occurrences = [];
var tempral = [];

function callData(val) {
  tempArray = [];
  $.getJSON("geoYearData/LSH/allLSHUtanSvea.json", function(json) {
    for (var i = 0 ; i < json.length ; i++){
      if(val == json[i].yearInterval[0]) {
          tempArray.push(json[i]);
      }
      if (i+1 == json.length) {
        plot(tempArray);
      }
    }
  });

}

  function plot(occ){
    $.getJSON("data.json", function(json) {
          
        var array = [];


          for (var i = 0 ; i < json.length ; i++) {
            for (var j = 0 ; j < occ.length ; j++){
              if (json[i].CountryName.toLowerCase() == occ[j].placeName.toLowerCase()) {
                array.push({name: json[i].CountryName, fillKey: 'RUS', latitude: json[i].CapitalLatitude, longitude: json[i].CapitalLongitude, radius: occ[j].amount*2});
              
              }
            }
          }
          
      zoom.bubbles(array, {
        popupTemplate: function(geo, data) {
          return "<div class='hoverinfo'>Bubble for " + "array.countryName";
        }
      });
    });

  }



var snapSlider = document.getElementById('slider-snap');

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
    '95%': 1850,
    'max': 1900
  }
});

var snapValues = [
  document.getElementById('slider-snap-value-lower'),
  document.getElementById('slider-snap-value-upper')
];

snapSlider.noUiSlider.on('update', function( values, handle ) {
  val = parseInt(values[0]);
  callData(val);
  snapValues[handle].innerHTML = val+"-"+ (val+50);
});
    /**
     * Load some data
     * @return {Object} Returned object
     */
    // QueryService.query('GET', 'posts', {}, {})
    //   .then(function(ovocie) {
    //     self.ovocie = ovocie.data;
    //   });
  }


})();