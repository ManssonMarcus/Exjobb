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




    ////////////  function definitions
    
   var zoom = new Datamap({
  element: document.getElementById("mapContainer"),
  responsive: true,
  scope: 'world',
  // Zoom in on Africa
  setProjection: function(element) {
    var projection = d3.geo.equirectangular()
      .center([15.44, 57.7605])
      .rotate([4.4, 0])
      .scale(400)
      .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
    var path = d3.geo.path()
      .projection(projection);
    
    return {path: path, projection: projection};
  },
  fills: {
    defaultFill: "#ABDDA4",
    gt50: "#FA1",
    gt500: "#55F"
    
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

function callData(lowerVal, upperVal) {
  $.ajax({
      //dataType: "json",
      url: 'http://kulturarvsdata.se/ksamsok/api?stylesheet=&x-api=lsh772&method=search&hitsPerPage=500&sort=serviceOrganization&startRecord='+500+'&query=create_toTime%3E%3D'+lowerVal+'+and+create_fromTime%3C%3D'+upperVal,
      type: 'GET',
      withCredentials: true,
  })
  .done(function(dataFromKsam) {

    console.log(dataFromKsam);

    var hits = dataFromKsam.getElementsByTagName("totalHits")[0].childNodes[0].nodeValue;   
    
    for (var i = 0 ; i < 500 ; i++){

      country = dataFromKsam.getElementsByTagName("countryName")[i];
      museum = dataFromKsam.getElementsByTagName("serviceOrganization")[i].childNodes[0].nodeValue;
      // place = dataFromKsam.getElementsByTagName("placeLabel")[i];
      // year =  dataFromKsam.getElementsByTagName("timeLabel")[i];
      // description = dataFromKsam.getElementsByTagName("desc")[i];

      if (country) {
        //workaround for checking if value exists in object-Array
        if (tempral.indexOf(country.childNodes[0].nodeValue) == -1) {
            occurrences.push({place: country.childNodes[0].nodeValue, value: 1});
            tempral.push(country.childNodes[0].nodeValue);
        } 
        else {
          occurrences[tempral.indexOf(country.childNodes[0].nodeValue)].value++;
        }   
      }
      if (i+1 == 500) {
        tempral = [];
        plot(occurrences, museum);
        occurrences = [];
      }
    }

  }).fail(function(req) { 
    console.log("err");
  });

}

  function plot(occ, museum){
    $.getJSON("data.json", function(json) {
          
        var array = [];

          for (var i = 0 ; i < json.length ; i++) {
            for (var j = 0 ; j < occ.length ; j++){
              if (json[i].CountryName == occ[j].place) {
                array.push({name: json[i].CountryName, latitude: json[i].CapitalLatitude, longitude: json[i].CapitalLongitude, radius: occ[j].value/2});
              }
            }
          }
          
          zoom.bubbles(array, {
         popupTemplate: function(geo, data) {
           return "<div class='hoverinfo'>Bubble for " + museum + "";
         }
        });
    });
  }

var snapSlider = document.getElementById('slider-snap');

noUiSlider.create(snapSlider, {
  start: [ 1600, 1700 ],
  snap: true,
  connect: true,
  range: {
    'min': 1500,
    '15%':  1550,
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
  callData(values[0], values[1]);
  snapValues[handle].innerHTML = values[handle];
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